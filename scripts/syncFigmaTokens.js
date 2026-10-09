// scripts/syncFigmaTokens.js
const fs = require('fs');
const path = require('path');
const tinycolor = require('tinycolor2');

const tokensPath = path.resolve(__dirname, '../tokens/figma-tokens.json');
const inputCSSPath = path.resolve(__dirname, '../src/input.css');
const customColorsPath = path.resolve(__dirname, '../custom-colors.json');
const tailwindConfigPath = path.resolve(__dirname, '../tailwind.config.cjs');

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

// 2. W3C DTCG / Figma 값 추출 헬퍼 ( { value: "#..." } 또는 직접 값 대응 )
function extractValue(node) {
  if (node === null || node === undefined) return '';
  if (typeof node === 'object' && node.value !== undefined) {
    return node.value;
  }
  return typeof node === 'string' || typeof node === 'number' ? node : '';
}

// 3. Figma Tokens JSON 파싱
function parseTokens(raw) {
  const tokens = typeof raw === 'string' ? JSON.parse(raw) : raw;
  const colors = {};
  const radius = {};
  const spacing = {};

  // Tokens Studio 형태(global 또는 최상위) 호환
  const root = tokens.global || tokens;

  // 3-1. 색상 파싱
  const colorSource = root.color || root.colors || {};
  Object.entries(colorSource).forEach(([colorKey, colorVal]) => {
    // case A: 50~950 단계별 객체인 경우
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

      if (hasShades) {
        colors[colorKey] = shades;
      } else if (colorVal.base) {
        const baseHex = extractValue(colorVal.base);
        colors[colorKey] = generatePalette(baseHex);
      }
    } else {
      // case B: 단일 색상 값인 경우 -> 자동 팔레트 생성
      const hex = extractValue(colorVal);
      if (hex && typeof hex === 'string') {
        colors[colorKey] = generatePalette(hex);
      }
    }
  });

  // 3-2. BorderRadius 파싱
  const radiusSource = root.borderRadius || root.radius || {};
  Object.entries(radiusSource).forEach(([k, v]) => {
    radius[k] = extractValue(v);
  });

  // 3-3. Spacing 파싱
  const spacingSource = root.spacing || root.space || {};
  Object.entries(spacingSource).forEach(([k, v]) => {
    spacing[k] = extractValue(v);
  });

  return { colors, radius, spacing };
}

// 4. src/input.css @theme 블록 업데이트
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

  // 컬러 토큰 주입
  Object.entries(parsedTokens.colors).forEach(([colorName, palette]) => {
    const marker = `/* custom-color-setting: ${colorName} */`;
    const lines = Object.entries(palette)
      .map(([level, hex]) => `  --color-${colorName}-${level}: ${hex};`)
      .join('\n');
    const newBlock = `${marker}\n${lines}\n`;

    const sectionRegex = new RegExp(
      `\\/\\*\\s*custom-color-setting:\\s*${colorName}\\s*\\*\\/([\\s\\S]*?)(?=\\/\\*\\s*custom-color-setting:|\\/\\*\\s*figma-radius:|$)`
    );

    if (sectionRegex.test(themeContent)) {
      themeContent = themeContent.replace(sectionRegex, newBlock);
    } else {
      themeContent = themeContent.trimEnd() + '\n\n' + newBlock;
    }
  });

  // 곡률(Radius) 토큰 주입
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
  console.log('✅ [1/3] src/input.css @theme 동기화 완료');
}

// 5. custom-colors.json 업데이트
function updateCustomColors(parsedTokens) {
  let current = {};
  if (fs.existsSync(customColorsPath)) {
    try {
      current = JSON.parse(fs.readFileSync(customColorsPath, 'utf-8'));
    } catch (e) {}
  }

  Object.entries(parsedTokens.colors).forEach(([name, palette]) => {
    // 500 레벨 또는 base를 대표 색상으로 등록
    current[`custom-${name}`] = palette['500'] || palette['base'] || Object.values(palette)[0];
  });

  fs.writeFileSync(customColorsPath, JSON.stringify(current, null, 2), 'utf-8');
  console.log('✅ [2/3] custom-colors.json 동기화 완료');
}

// 6. Tailwind Config 타임스탬프 갱신 (리빌드 트리거)
function touchTailwindConfig() {
  if (fs.existsSync(tailwindConfigPath)) {
    const now = new Date();
    fs.utimesSync(tailwindConfigPath, now, now);
    console.log('✅ [3/3] tailwind.config.cjs 타임스탬프 갱신 (Tailwind 빌드 감지 트리거)');
  }
}

// 메인 실행 함수
function runSync() {
  console.log('\n🚀 [Figma ➔ ThemeUI] 디자인 토큰 파이프라인 동기화 시작...\n');

  if (!fs.existsSync(tokensPath)) {
    console.error(`[오류] 토큰 파일을 찾을 수 없습니다: ${tokensPath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(tokensPath, 'utf-8');
  const parsed = parseTokens(raw);

  console.log(`📦 감지된 Figma 토큰 목록:`);
  console.log(`   - Colors: ${Object.keys(parsed.colors).join(', ') || '없음'}`);
  console.log(`   - Radius: ${Object.keys(parsed.radius).join(', ') || '없음'}`);
  console.log(`   - Spacing: ${Object.keys(parsed.spacing).join(', ') || '없음'}\n`);

  updateInputCSS(parsed);
  updateCustomColors(parsed);
  touchTailwindConfig();

  console.log('\n🎉 [성공] Figma 디자인 토큰이 현재 테마 시스템에 성공적으로 반영되었습니다!\n');
}

runSync();
