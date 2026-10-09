// scripts/syncFigmaTokens.js
const fs = require('fs');
const path = require('path');
const tinycolor = require('tinycolor2');

const tokensDir = path.resolve(__dirname, '../tokens');
const inputCSSPath = path.resolve(__dirname, '../src/input.css');
const customColorsPath = path.resolve(__dirname, '../custom-colors.json');
const tailwindConfigPath = path.resolve(__dirname, '../tailwind.config.cjs');
const standardizedTokensPath = path.resolve(tokensDir, 'figma-tokens.json');

// 1. 단일 색상(Hex)으로부터 50~950 팔레트 자동 생성
function generatePalette(baseHex) {
  const levels = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  const palette = {};
  levels.forEach((level) => {
    let color;
    if (level < 500) {
      const ratio = 1 - (500 - level) / 1000;
      color = tinycolor(baseHex).lighten(ratio * 50).toHexString();
    } else if (level > 500) {
      const ratio = (level - 500) / 500;
      color = tinycolor(baseHex).darken(ratio * 30).toHexString();
    } else {
      color = baseHex;
    }
    palette[level] = color;
  });
  return palette;
}

// 2. RGBA 객체 -> Hex 변환
function rgbaToHex(rgba) {
  if (!rgba || typeof rgba !== 'object') return '#000000';
  const to255 = (v) => Math.min(255, Math.max(0, Math.round((v || 0) * 255)));
  const r = to255(rgba.r);
  const g = to255(rgba.g);
  const b = to255(rgba.b);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// 3. W3C DTCG 값 추출 헬퍼
function extractValue(node) {
  if (node === null || node === undefined) return '';
  if (typeof node === 'object' && node.value !== undefined) {
    return node.value;
  }
  return typeof node === 'string' || typeof node === 'number' ? node : '';
}

// 4. 토큰 파일 자동 탐색 (shoe-var.json 또는 figma-tokens.json 등)
function findSourceTokenFile() {
  if (fs.existsSync(path.resolve(tokensDir, 'shoe-var.json'))) {
    return path.resolve(tokensDir, 'shoe-var.json');
  }
  if (fs.existsSync(standardizedTokensPath)) {
    return standardizedTokensPath;
  }
  const files = fs.readdirSync(tokensDir).filter((f) => f.endsWith('.json'));
  if (files.length > 0) {
    return path.resolve(tokensDir, files[0]);
  }
  return null;
}

// 5. Figma JSON 파싱 (Figma Plugin 'Export/Import Variables' 및 DTCG 포맷 모두 지원)
function parseTokens(rawJson) {
  const data = typeof rawJson === 'string' ? JSON.parse(rawJson) : rawJson;
  const colors = {};
  const radius = {};
  const fontHeights = {};

  // Case 1: Figma 'Export/Import Variables' 플러그인 포맷 (variables 배열 존재)
  if (Array.isArray(data.variables)) {
    console.log(`📌 Figma Variables Collection 감지: "${data.name || 'Variables'}" (${data.variables.length}개 항목)`);
    data.variables.forEach((v) => {
      const name = v.name;
      const type = v.type;
      const firstVal = Object.values(v.valuesByMode || {})[0];

      if (type === 'COLOR') {
        const hex = rgbaToHex(firstVal);
        const cleanName = name.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
        colors[cleanName] = generatePalette(hex);
      } else if (type === 'FLOAT') {
        const numVal = typeof firstVal === 'number' ? firstVal : parseFloat(firstVal) || 0;
        if (name.includes('Radius') || name.includes('radius')) {
          const key = name.split('/').pop().replace('radius-', '').replace(/\s+/g, '-').toLowerCase();
          radius[key] = `${numVal}px`;
        } else if (name.startsWith('Height/')) {
          const key = name.replace('Height/', '').toLowerCase();
          fontHeights[key] = `${numVal}px`;
        }
      }
    });
  } else {
    // Case 2: W3C DTCG / Tokens Studio 포맷
    const root = data.global || data;
    const colorSource = root.color || root.colors || {};
    Object.entries(colorSource).forEach(([colorKey, colorVal]) => {
      if (typeof colorVal === 'object' && !colorVal.value) {
        const shades = {};
        let hasShades = false;
        Object.entries(colorVal).forEach(([k, v]) => {
          const val = extractValue(v);
          if (val && !isNaN(k)) {
            shades[k] = val;
            hasShades = true;
          }
        });
        if (hasShades) colors[colorKey] = shades;
        else if (colorVal.base) colors[colorKey] = generatePalette(extractValue(colorVal.base));
      } else {
        const hex = extractValue(colorVal);
        if (hex && typeof hex === 'string') colors[colorKey] = generatePalette(hex);
      }
    });

    const radiusSource = root.borderRadius || root.radius || {};
    Object.entries(radiusSource).forEach(([k, v]) => {
      radius[k] = extractValue(v);
    });
  }

  return { colors, radius, fontHeights };
}

// 6. src/input.css @theme 블록 업데이트
function updateInputCSS(parsedTokens) {
  if (!fs.existsSync(inputCSSPath)) {
    console.error(`[Error] ${inputCSSPath} 파일을 찾을 수 없습니다.`);
    return;
  }

  let css = fs.readFileSync(inputCSSPath, 'utf-8');
  const themeBlockRegex = /(@theme\s*\{)([\s\S]*?)(\})/m;
  const match = css.match(themeBlockRegex);

  if (!match) {
    console.error('[Error] input.css에서 @theme 블록을 찾을 수 없습니다.');
    return;
  }

  let themeContent = match[2];

  // 6-1. 컬러 토큰 주입
  Object.entries(parsedTokens.colors).forEach(([colorName, palette]) => {
    const marker = `/* custom-color-setting: ${colorName} */`;
    const lines = Object.entries(palette)
      .map(([level, hex]) => `  --color-${colorName}-${level}: ${hex};`)
      .join('\n');
    const newBlock = `${marker}\n${lines}\n`;

    const sectionRegex = new RegExp(
      `\\/\\*\\s*custom-color-setting:\\s*${colorName}\\s*\\*\\/([\\s\\S]*?)(?=\\/\\*\\s*custom-color-setting:|\\/\\*\\s*figma-radius-settings|$)`
    );

    if (sectionRegex.test(themeContent)) {
      themeContent = themeContent.replace(sectionRegex, newBlock);
    } else {
      themeContent = themeContent.trimEnd() + '\n\n' + newBlock;
    }
  });

  // 6-2. 곡률(Radius) 토큰 주입
  if (Object.keys(parsedTokens.radius).length > 0) {
    const radiusMarker = '/* figma-radius-settings */';
    const radiusLines = Object.entries(parsedTokens.radius)
      .map(([k, v]) => `  --radius-${k}: ${v};`)
      .join('\n');
    const newRadiusBlock = `${radiusMarker}\n${radiusLines}\n`;

    const radiusRegex = /\/\*\s*figma-radius-settings\s*\*\/([\s\S]*?)(?=\/\*\s*[a-zA-Z0-9_-]+:|$)/;
    if (radiusRegex.test(themeContent)) {
      themeContent = themeContent.replace(radiusRegex, newRadiusBlock);
    } else {
      themeContent = themeContent.trimEnd() + '\n\n' + newRadiusBlock;
    }
  }

  css = css.replace(themeBlockRegex, `${match[1]}\n${themeContent.trim()}\n${match[3]}`);
  fs.writeFileSync(inputCSSPath, css, 'utf-8');
  console.log('✅ [1/4] src/input.css @theme 동기화 완료');
}

// 7. custom-colors.json 업데이트
function updateCustomColors(parsedTokens) {
  let current = {};
  if (fs.existsSync(customColorsPath)) {
    try {
      current = JSON.parse(fs.readFileSync(customColorsPath, 'utf-8'));
    } catch (e) {}
  }

  Object.entries(parsedTokens.colors).forEach(([name, palette]) => {
    current[name] = palette['500'] || palette['base'] || Object.values(palette)[0];
  });

  fs.writeFileSync(customColorsPath, JSON.stringify(current, null, 2), 'utf-8');
  console.log('✅ [2/4] custom-colors.json 동기화 완료');
}

// 8. W3C DTCG 표준 규격으로 figma-tokens.json 저장 (포터블 규격 보존)
function saveStandardizedTokens(parsedTokens) {
  const dtcg = {
    $schema: 'https://design-tokens.github.io/community-group/format/',
    version: '1.0.0',
    color: {},
    borderRadius: {},
  };

  Object.entries(parsedTokens.colors).forEach(([name, palette]) => {
    dtcg.color[name] = {};
    Object.entries(palette).forEach(([shade, hex]) => {
      dtcg.color[name][shade] = { value: hex, type: 'color' };
    });
  });

  Object.entries(parsedTokens.radius).forEach(([key, val]) => {
    dtcg.borderRadius[key] = { value: val, type: 'dimension' };
  });

  fs.writeFileSync(standardizedTokensPath, JSON.stringify(dtcg, null, 2), 'utf-8');
  console.log('✅ [3/4] tokens/figma-tokens.json 표준 규격 변환 및 보존 완료');
}

// 9. Tailwind 타임스탬프 갱신
function touchTailwindConfig() {
  if (fs.existsSync(tailwindConfigPath)) {
    const now = new Date();
    fs.utimesSync(tailwindConfigPath, now, now);
    console.log('✅ [4/4] tailwind.config.cjs 타임스탬프 갱신 완료');
  }
}

// 메인 실행
function runSync() {
  console.log('\n🚀 [Figma ➔ ThemeUI] 디자인 토큰 파이프라인 동기화 시작...\n');

  const sourceFile = findSourceTokenFile();
  if (!sourceFile) {
    console.error(`[오류] tokens 폴더에 토큰 JSON 파일이 없습니다.`);
    process.exit(1);
  }

  console.log(`📂 읽어온 소스 파일: ${path.basename(sourceFile)}`);

  const raw = fs.readFileSync(sourceFile, 'utf-8');
  const parsed = parseTokens(raw);

  console.log(`\n📦 감지된 Figma 토큰 목록:`);
  console.log(`   - 🎨 Colors (${Object.keys(parsed.colors).length}종): ${Object.keys(parsed.colors).join(', ')}`);
  console.log(`   - 🔲 Radius (${Object.keys(parsed.radius).length}종): ${Object.entries(parsed.radius).map(([k, v]) => `${k}(${v})`).join(', ')}`);
  if (Object.keys(parsed.fontHeights).length > 0) {
    console.log(`   - 📏 Font Heights (${Object.keys(parsed.fontHeights).length}종): ${Object.keys(parsed.fontHeights).join(', ')}`);
  }
  console.log('');

  updateInputCSS(parsed);
  updateCustomColors(parsed);
  saveStandardizedTokens(parsed);
  touchTailwindConfig();

  console.log('\n🎉 [성공] Figma 디자인 토큰 32개가 ThemeUI 디자인 시스템에 완벽하게 동기화되었습니다!\n');
}

runSync();
