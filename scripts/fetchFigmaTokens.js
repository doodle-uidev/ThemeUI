// scripts/fetchFigmaTokens.js
/**
 * Figma REST API를 통해 Figma Variables를 직접 내려받아 tokens/figma-tokens.json으로 저장하는 스크립트입니다.
 * 
 * 사용법:
 *   FIGMA_ACCESS_TOKEN="<토큰>" FIGMA_FILE_KEY="<파일키>" node scripts/fetchFigmaTokens.js
 */

const fs = require('fs');
const path = require('path');

const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;
const outputPath = path.resolve(__dirname, '../tokens/figma-tokens.json');

async function fetchTokens() {
  if (!FIGMA_ACCESS_TOKEN || !FIGMA_FILE_KEY) {
    console.log('\nℹ️ [안내] FIGMA_ACCESS_TOKEN 또는 FIGMA_FILE_KEY 환경변수가 설정되지 않았습니다.');
    console.log('   - Figma API를 사용하시려면 다음처럼 실행하세요:');
    console.log('     $env:FIGMA_ACCESS_TOKEN="토큰"; $env:FIGMA_FILE_KEY="파일키"; npm run tokens:fetch\n');
    console.log('   - 또는 Figma 플러그인(Tokens Studio 등)에서 tokens/figma-tokens.json 으로 직접 내보내셔도 됩니다.\n');
    return;
  }

  console.log(`\n📡 Figma API 호출 중... (File: ${FIGMA_FILE_KEY})`);

  try {
    const url = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/variables/local`;
    const res = await fetch(url, {
      headers: {
        'X-Figma-Token': FIGMA_ACCESS_TOKEN,
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    }

    const data = await res.json();
    console.log('✅ Figma Variables 데이터 수신 완료!');

    // Figma API 응답 데이터를 tokens/figma-tokens.json 규격으로 변환
    const converted = convertFigmaVariablesToDTCG(data);
    fs.writeFileSync(outputPath, JSON.stringify(converted, null, 2), 'utf-8');
    console.log(`✅ [저장 완료] ${outputPath}\n`);

    // 즉시 동기화 실행
    require('./syncFigmaTokens.js');
  } catch (err) {
    console.error('❌ [Figma API 호출 실패]:', err.message);
  }
}

function convertFigmaVariablesToDTCG(figmaData) {
  const result = {
    color: {},
    borderRadius: {},
  };

  const variables = figmaData?.meta?.variables || {};
  Object.values(variables).forEach((v) => {
    const name = v.name; // 예: "color/primary/500" 또는 "radius/md"
    const valuesByMode = Object.values(v.valuesByMode || {});
    const val = valuesByMode[0];

    if (v.resolvedType === 'COLOR' && typeof val === 'object') {
      // RGBA -> Hex 변환
      const r = Math.round((val.r || 0) * 255);
      const g = Math.round((val.g || 0) * 255);
      const b = Math.round((val.b || 0) * 255);
      const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;

      const parts = name.split('/');
      const key = parts[parts.length - 1] || 'base';
      const category = parts[1] || 'primary';
      if (!result.color[category]) result.color[category] = {};
      result.color[category][key] = { value: hex, type: 'color' };
    } else if (v.resolvedType === 'FLOAT') {
      const parts = name.split('/');
      const key = parts[parts.length - 1] || 'md';
      result.borderRadius[key] = { value: `${val}px`, type: 'dimension' };
    }
  });

  return result;
}

fetchTokens();
