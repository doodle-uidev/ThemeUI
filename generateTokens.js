// generateTokens.js
const fs = require('fs');
const path = require('path');
const tailwindConfig = require('./tailwind.config.cjs');
const { parse, formatHex } = require('culori'); // ✅ parse, formatHex 사용

function convertOklchToHex(value) {
  // oklch 형태일 때 변환
  if (typeof value === 'string' && value.startsWith('oklch')) {
    const color = parse(value);
    return formatHex(color);
  }
  return value;
}

function deepConvertToW3CFormat(obj) {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object') {
      result[key] = deepConvertToW3CFormat(value);
    } else {
      result[key] = { value: convertOklchToHex(value) }; // ✅ W3C DTCG 형식
    }
  }
  return result;
}

function extractTokens() {
  const colors = tailwindConfig.theme.extend.colors;
  const convertedColors = deepConvertToW3CFormat(colors);

  const json = JSON.stringify({ color: convertedColors }, null, 2); // ✅ DTCG 최상위 color
  fs.writeFileSync(path.resolve(__dirname, 'tailwind-tokens-figma.json'), json);

  console.log("✅ W3C DTCG 형식으로 Tokens 생성 완료!");
}

extractTokens();
