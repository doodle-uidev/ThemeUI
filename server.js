const express = require('express');
const fs = require('fs');
const path = require('path');
const tailwindColors = require('tailwindcss/colors');
const customColors = require('./custom-colors.json'); // 사용자 정의 색상 파일 불러오기

const app = express();
const tailwindConfigPath = './tailwind.config.cjs';

app.get('/save-color', (req, res) => {
  const { color } = req.query;

  if (!color) return res.status(400).send('Color is required');

  const key = color.toLowerCase().replace(/\s+/g, '-');

  // 먼저 내장 Tailwind 색상에서 찾고, 없으면 사용자 정의 색상에서 찾기
  let colorValue = tailwindColors[color];
  if (!colorValue) {
    colorValue = customColors[color];
  }

  if (!colorValue) {
    return res.status(400).send(`❌ '${color}' is not a valid Tailwind CSS color`);
  }

  try {
    const configText = fs.readFileSync(tailwindConfigPath, 'utf-8');

    // 이미 등록되어 있는지 확인
    const isAlreadyRegistered = new RegExp(`\\b${key}\\b\\s*:`).test(configText);
    if (isAlreadyRegistered) {
      console.log(`⚠️ '${color}' is already registered in tailwind.config.cjs`);
      return res.send(`⚠️ '${color}' is already registered in tailwind.config.cjs`);
    }

    const updatedConfig = injectTailwindColor(configText, key, colorValue);
    fs.writeFileSync(tailwindConfigPath, updatedConfig);
    console.log(`✅ '${color}' added to tailwind.config.cjs`);
    return res.send(`✅ '${color}' added to tailwind.config.cjs`);
  } catch (err) {
    console.error('Error updating tailwind.config.cjs:', err);
    return res.status(500).send('Failed to update tailwind.config.cjs');
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

function injectTailwindColor(configText, key, colorValue) {
  // 이미 등록된 키가 있는지 단순 문자열 검색
  if (configText.indexOf(`"${key}":`) !== -1) {
    console.log(`⚠️ '${key}' already exists in tailwind.config.cjs — skipping injection.`);
    return configText; // 이미 있으면 그대로 반환
  }

  const insertLine = `      ${JSON.stringify(key)}: ${JSON.stringify(colorValue, null, 2)},\n`;

  if (configText.includes(`extend:`) && configText.includes(`colors:`)) {
    return configText.replace(/(colors:\s*{)/, `$1\n${insertLine}`);
  } else if (configText.includes(`extend:`)) {
    return configText.replace(/(extend:\s*{)/, `$1\n    colors: {\n${insertLine}    },`);
  } else {
    return configText.replace(/(theme:\s*{)/, `$1\n    extend: {\n      colors: {\n${insertLine}      }\n    },`);
  }
}
