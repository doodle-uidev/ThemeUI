import colors from 'tailwindcss/colors';
import customColors from '../../../custom-colors.json';

// 기본 Tailwind 색상 추출 (흰색/검정/투명 제외)
const getTailwindColors = () => Object.keys(colors).filter(
  (key) =>
    typeof colors[key] === 'object' &&
    key !== 'inherit' &&
    key !== 'current' &&
    key !== 'transparent' &&
    key !== 'black' &&
    key !== 'white'
);

import { themeStore } from '../themeStore';

// 전역 상태로 현재 선택된 baseColor 관리 (themeStore와 연동)
let currentBaseColor = themeStore.getActiveTheme().primaryColor || 'blue';

export const colorSystem = {
  // 모든 사용 가능한 색상 옵션 반환
  getColorOptions: () => {
    const tailwindColors = getTailwindColors();
    return [...tailwindColors, '—— 커스텀 컬러 ——', ...Object.keys(customColors)];
  },

  // 현재 선택된 baseColor 설정
  setCurrentBaseColor: (color) => {
    if (!color || color === '—— 커스텀 컬러 ——') {
      return;
    }
    currentBaseColor = color;
    themeStore.setTheme({ primaryColor: color });
  },

  // 현재 선택된 baseColor 반환 (themeStore의 primaryColor 항상 최신 참조)
  getCurrentBaseColor: () => {
    try {
      return themeStore.getActiveTheme().primaryColor || currentBaseColor || 'blue';
    } catch (e) {
      return currentBaseColor || 'blue';
    }
  },

  // 커스텀 컬러 저장 로직 (Theme Builder에서 명시적으로 호출할 때만 사용)
  saveColorToCustomColors: async (color) => {
    try {
      if (!color || color === '—— 커스텀 컬러 ——') return;
      const response = await fetch(`/save-color?color=${color}`, {
        method: 'GET',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
      });
      return await response.text();
    } catch (error) {
      // server.js가 실행 중이지 않을 때는 조용히 무시 (프록시 에러 방지)
      return null;
    }
  }
};
