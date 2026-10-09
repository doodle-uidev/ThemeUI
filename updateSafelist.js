// updateSafelist.js
const fs = require("fs");
const chokidar = require("chokidar");
const glob = require("glob");
const path = require("path");
const tailwindColors = require("tailwindcss/colors");

const customColorsPath = path.join(__dirname, "custom-colors.json");

// HTML/JS/TS 파일에서 color="xxx" 값 추출
const extractColorsFromHTML = () => {
  const files = glob.sync('src/**/*.{html,js,ts,jsx,tsx}');
  const colors = new Set();
  const colorRegex = /color=['"`]([\w-]+)['"`]/g;

  files.forEach(file => {
    const content = fs.readFileSync(file, "utf-8");
    let match;
    while ((match = colorRegex.exec(content)) !== null) {
      colors.add(match[1]);
    }
  });

  return colors;
};

// custom-colors.json에서 색상 키 추출
const extractColorsFromCustomColors = () => {
  if (!fs.existsSync(customColorsPath)) return new Set();
  const fileContent = fs.readFileSync(customColorsPath, "utf-8");
  const customColors = JSON.parse(fileContent);
  return new Set(Object.keys(customColors));
};

// tailwind 기본 색상 추출 + 보조 기본 색상 보완
const extractTailwindDefaultColors = () => {
  const exclude = ['inherit', 'current', 'transparent', 'black', 'white'];
  const baseColors = Object.keys(tailwindColors).filter(
    (key) => typeof tailwindColors[key] === "object" && !exclude.includes(key)
  );

  // 누락 방지를 위한 강제 기본색상 추가
  const extraColors = [
    "zinc", "gray", "neutral", "stone", "slate", "coolGray",
    "red", "orange", "amber", "yellow", "lime",
    "green", "emerald", "teal", "cyan", "sky",
    "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose"
  ];

  return new Set([...baseColors, ...extraColors]);
};

// safelist 클래스 생성
const generateSafelist = (colors) => {
  const levels = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  const prefixes = [
    "bg", "text", "from", "to", "hover:bg", "focus:bg", "border", "focus:ring", "border-b",
    "hover:from", "hover:to", "focus:from", "focus:to", 'dark:bg', 'dark:text', 
    'dark:from', 'dark:to', 'dark:hover:bg', 'dark:focus:bg', 'dark:border', 
    'dark:focus:ring', 'dark:hover:from', 'dark:hover:to','dark:hover:text', 'dark:focus:from', 'dark:hover:border', 
    'dark:focus:to', 'focus:outline', 'focus:ring-offset', 'focus:ring', 
    'outline-offset', 'ring-offset-color', 'ring-color', 'outline', 
    'ring', 'shadow', 'focus:shadow', 'focus:ring-shadow', 'focus:ring-offset-shadow',
    'focus:ring-color', 'ring-offset', 'ring-shadow', 'focus:ring-inset', 
    'focus:ring-offset-width', 'focus:ring-offset-color', 'focus:ring-shadow', 'focus:border',
    'border-color', 'box-shadow', 'check', 
    "autofill:bg", "autofill:border", "autofill:text", "focus:autofill:bg",
    'peer-checked:bg','peer-focus:ring','peer-focus:ring-offset','peer-focus:ring-offset-color', 
    'dark:peer-checked:bg','dark:peer-focus:ring','dark:peer-focus:ring-offset','dark:peer-focus:ring-offset-color', 
  ];
  
  
  const safelist = [];

  colors.forEach((color) => {
    levels.forEach((level) => {
      prefixes.forEach((prefix) => {
        safelist.push(`${prefix}-${color}-${level}`);
      });
    });
  });

  return safelist;
};

// tailwind.config.cjs의 SAFELIST 영역 업데이트
const updateTailwindConfigSafelist = (safelist) => {
  const configPath = path.resolve("tailwind.config.cjs");
  let config = fs.readFileSync(configPath, "utf-8");

  const markerStart = '// SAFELIST_START';
  const markerEnd = '// SAFELIST_END';
  const safelistRegex = new RegExp(`(${markerStart})([\\s\\S]*?)(${markerEnd})`, 'gm');

  if (!safelistRegex.test(config)) {
    console.warn("[WARN] ❌ SAFELIST markers not found. Skipping update.");
    return;
  }

  const safelistArrayFormatted = JSON.stringify(safelist, null, 2)
    .split('\n')
    .map(line => '    ' + line)
    .join('\n');

  const newSafelistBlock = `${markerStart}\n${safelistArrayFormatted}\n    ${markerEnd}`;

  const updatedConfig = config.replace(safelistRegex, newSafelistBlock);
  fs.writeFileSync(configPath, updatedConfig, "utf-8");
  console.log("[INFO] ✅ Safelist updated in tailwind.config.cjs");
};

// 메인 실행 로직
const runSafelistUpdate = () => {
  const htmlColors = extractColorsFromHTML();
  const customColors = extractColorsFromCustomColors();
  const defaultColors = extractTailwindDefaultColors();

  const allColors = new Set([...htmlColors, ...customColors, ...defaultColors]);
  const safelist = generateSafelist(allColors);
  updateTailwindConfigSafelist(safelist);
};

// Watcher 시작
const startWatcher = () => {
  const watchPaths = [
    'src/**/*.{html,js,ts,jsx,tsx}',
    'src/stories/**/*.{html,js,ts,jsx,tsx}',
    'custom-colors.json'
  ];

  chokidar.watch(watchPaths)
    .on("change", (filePath) => {
      console.log("[INFO] File changed:", filePath);
      runSafelistUpdate();
    })
    .on("error", (err) => {
      console.error("[ERROR] Watcher error:", err);
    });

  console.log("[INFO] Safelist Watcher running...");
};

// 처음 실행 시도 바로 업데이트
runSafelistUpdate();
startWatcher();
