const fs = require("fs");
const path = require("path");
const tinycolor = require("tinycolor2");
const chokidar = require("chokidar");

// 기본 색상으로부터 단계별 팔레트 생성 함수
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

// input.css의 @theme 블록 내에서 각 컬러 네임 섹션 업데이트 또는 추가
function updateInputCSSWithCustomColors(colorsConfig) {
  const filePath = path.join(__dirname, "src", "input.css");
  let cssContent = fs.readFileSync(filePath, "utf-8");

  // @theme 블록 전체 추출
  const themeBlockRegex = /(@theme\s*\{)([\s\S]*?)(\})/m;
  const themeMatch = cssContent.match(themeBlockRegex);
  if (!themeMatch) {
    console.error("input.css에서 @theme 블록을 찾을 수 없습니다.");
    process.exit(1);
  }
  const themeStart = themeMatch[1];
  let themeContent = themeMatch[2];
  const themeEnd = themeMatch[3];

  // 각 컬러 네임별로 섹션 처리
  Object.entries(colorsConfig).forEach(([colorName, baseColor]) => {
    const palette = generatePalette(baseColor);
    const markerComment = `/* custom-color-setting: ${colorName} */`;
    const paletteLines = Object.entries(palette)
      .map(([level, color]) => `  --color-${colorName}-${level}: ${color};`)
      .join("\n");
    const newSection = `${markerComment}\n${paletteLines}\n`;

    // 해당 컬러 네임 섹션 검사 및 업데이트
    const sectionRegex = new RegExp(`\\/\\*\\s*custom-color-setting:\\s*${colorName}\\s*\\*\\/([\\s\\S]*?)(?=\\/\\*\\s*custom-color-setting:|$)`);
    if (sectionRegex.test(themeContent)) {
      themeContent = themeContent.replace(sectionRegex, newSection);
      console.log(`컬러 네임 "${colorName}" 업데이트됨.`);
    } else {
      themeContent = themeContent.trimEnd() + "\n\n" + newSection;
      console.log(`새 컬러 네임 "${colorName}" 추가됨.`);
    }
  });

  // 업데이트된 @theme 블록 반영
  const newThemeBlock = `${themeStart}\n${themeContent}\n${themeEnd}`;
  cssContent = cssContent.replace(themeBlockRegex, newThemeBlock);
  fs.writeFileSync(filePath, cssContent, "utf-8");
  console.log("input.css 업데이트 완료");
}

// tailwind.config.cjs 타임스탬프 업데이트 (watch 모드 재트리거)
function touchTailwindConfig() {
  const configPath = path.join(__dirname, "tailwind.config.cjs");
  fs.utimesSync(configPath, new Date(), new Date());
  console.log("tailwind.config.cjs 타임스탬프 업데이트 완료");
}

// custom-colors.json 읽기
function loadCustomColors() {
  const configPath = path.join(__dirname, "custom-colors.json");
  const fileContent = fs.readFileSync(configPath, "utf-8");
  return JSON.parse(fileContent);
}

// 실행: custom-colors.json에서 색상 설정을 읽어 업데이트 진행
function runUpdate() {
  const customColors = loadCustomColors();
  updateInputCSSWithCustomColors(customColors);
  touchTailwindConfig();
}

// 파일 감시 및 변경 시 자동 실행
const watcher = chokidar.watch(path.join(__dirname, "custom-colors.json"), {
  persistent: true
});

watcher.on('change', (path) => {
  console.log(`파일 변경됨: ${path}`);
  runUpdate();
});

// 처음 실행
runUpdate();
