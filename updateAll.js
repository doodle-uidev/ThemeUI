// updateAll.js
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const tinycolor = require('tinycolor2');

const customColorsPath = path.join(__dirname, 'custom-colors.json');
const inputCSSPath = path.join(__dirname, 'src', 'input.css');
const tailwindConfigPath = path.join(__dirname, 'tailwind.config.cjs');

// 1. 기본 색상으로부터 단계별 팔레트 생성
function generatePalette(baseHex) {
  const levels = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  const palette = {};
  levels.forEach(level => {
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

// 2. input.css의 @theme 블록 업데이트
function updateInputCSSWithCustomColors(customColors) {
  let cssContent = fs.readFileSync(inputCSSPath, 'utf-8');
  // @theme 블록 전체 추출 (정규식)
  const themeBlockRegex = /(@theme\s*\{)([\s\S]*?)(\})/m;
  const themeMatch = cssContent.match(themeBlockRegex);
  if (!themeMatch) {
    console.error("input.css에서 @theme 블록을 찾을 수 없습니다.");
    process.exit(1);
  }
  const themeStart = themeMatch[1];
  let themeContent = themeMatch[2];
  const themeEnd = themeMatch[3];

  // 각 컬러 이름에 대해 팔레트 생성 및 블록 업데이트
  Object.entries(customColors).forEach(([colorName, baseColor]) => {
    const palette = generatePalette(baseColor);
    const markerComment = `/* custom-color-setting: ${colorName} */`;
    const paletteLines = Object.entries(palette)
      .map(([level, color]) => `  --color-${colorName}-${level}: ${color};`)
      .join('\n');
    const newSection = `${markerComment}\n${paletteLines}\n`;

    // 기존 섹션이 있다면 업데이트, 없다면 추가
    const sectionRegex = new RegExp(`\\/\\*\\s*custom-color-setting:\\s*${colorName}\\s*\\*\\/([\\s\\S]*?)(?=\\/\\*\\s*custom-color-setting:|$)`);
    if (sectionRegex.test(themeContent)) {
      themeContent = themeContent.replace(sectionRegex, newSection);
      console.log(`컬러 네임 "${colorName}" 업데이트됨.`);
    } else {
      themeContent = themeContent.trimEnd() + "\n\n" + newSection;
      console.log(`새 컬러 네임 "${colorName}" 추가됨.`);
    }
  });

  const newThemeBlock = `${themeStart}\n${themeContent}\n${themeEnd}`;
  cssContent = cssContent.replace(themeBlockRegex, newThemeBlock);
  fs.writeFileSync(inputCSSPath, cssContent, 'utf-8');
  console.log("input.css 업데이트 완료");
}

// 3. tailwind.config.cjs의 safelist 영역 업데이트
function updateTailwindConfigSafelist(customColors) {
  let config = fs.readFileSync(tailwindConfigPath, 'utf-8');
  const markerStart = '// SAFELIST_START';
  const markerEnd = '// SAFELIST_END';

  // customColors 객체의 키를 기반으로 safelist 생성
  const levels = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  const prefixes = ["bg", "text", "hover:bg", "focus:bg", "border", "focus:ring"];
  const safelist = [];
  Object.keys(customColors).forEach(color => {
    levels.forEach(level => {
      prefixes.forEach(prefix => {
        safelist.push(`${prefix}-${color}-${level}`);
      });
    });
  });

  const regex = new RegExp(`(${markerStart})([\\s\\S]*?)(${markerEnd})`, 'gm');
  if (!regex.test(config)) {
    console.warn("[WARN] SAFELIST 마커를 tailwind.config.cjs에서 찾지 못했습니다.");
    return;
  }
  const safelistArrayFormatted = JSON.stringify(safelist, null, 2)
    .split('\n')
    .map(line => '    ' + line)
    .join('\n');
  const newSafelistBlock = `${markerStart}\n${safelistArrayFormatted}\n    ${markerEnd}`;
  config = config.replace(regex, newSafelistBlock);
  fs.writeFileSync(tailwindConfigPath, config, 'utf-8');
  console.log("tailwind.config.cjs safelist 업데이트 완료");
}

// 4. tailwind.config.cjs 파일의 타임스탬프 터치 (Tailwind 재컴파일 트리거)
function touchTailwindConfig() {
  const now = new Date();
  fs.utimesSync(tailwindConfigPath, now, now);
  console.log("tailwind.config.cjs 타임스탬프 업데이트 완료");
}

// 5. 모든 업데이트를 순차적으로 실행하는 함수
function runAllUpdates() {
  console.log("\n[UpdateAll] 모든 업데이트 실행 중...\n");
  let customColors;
  try {
    customColors = JSON.parse(fs.readFileSync(customColorsPath, 'utf-8'));
  } catch (error) {
    console.error("custom-colors.json 파일을 읽는 중 오류 발생:", error);
    return;
  }
  updateInputCSSWithCustomColors(customColors);
  updateTailwindConfigSafelist(customColors);
  touchTailwindConfig();
}

// 6. custom-colors.json 파일 변경 감지 (debounce 포함)
const debounceTime = 300;
let timer;
chokidar.watch(customColorsPath, { ignoreInitial: true })
  .on("change", () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      runAllUpdates();
    }, debounceTime);
  });

// 7. 최초 업데이트 실행
runAllUpdates();
