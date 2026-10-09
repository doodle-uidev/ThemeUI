// src/stories/themeStore.js
import colors from 'tailwindcss/colors';
import customColors from '../../custom-colors.json';

const STORAGE_KEY = 'winhub_active_theme';

// 사용 가능한 Tailwind 기본 색상 목록
export const availableColors = Object.keys(colors).filter(
  (key) =>
    typeof colors[key] === 'object' &&
    !['inherit', 'current', 'transparent', 'black', 'white'].includes(key)
);

// 커스텀 색상 목록
export const availableCustomColors = Object.keys(customColors || {});

// 기본 테마 프리셋
export const defaultTheme = {
  name: 'Default Modern',
  primaryColor: 'blue',
  secondaryColor: 'indigo',
  neutralColor: 'slate',
  borderRadius: 'md',       // none, sm, md, lg, full
  density: 'comfortable',    // compact, comfortable, spacious
  animationDuration: 300,   // ms (motion token)
  mode: 'light',            // light, dark
};

class ThemeStore {
  constructor() {
    this.theme = this.loadTheme();
    this.listeners = new Set();
  }

  // 로컬 스토리지에서 테마 불러오기
  loadTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...defaultTheme, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to load theme from localStorage', e);
    }
    return { ...defaultTheme };
  }

  // 현재 테마 반환
  getActiveTheme() {
    return { ...this.theme };
  }

  // 테마 업데이트
  setTheme(newTheme) {
    this.theme = { ...this.theme, ...newTheme };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.theme));
    } catch (e) {
      console.warn('Failed to save theme to localStorage', e);
    }

    // 변경 알림 이벤트 발생 (다른 컴포넌트들이 실시간 반응)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('winhubThemeChanged', { detail: this.theme }));
    }

    this.notify();
  }

  // 변경 구독
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    this.listeners.forEach((cb) => {
      try {
        cb(this.theme);
      } catch (err) {
        console.error(err);
      }
    });
  }

  // 테마 초기화
  resetTheme() {
    this.setTheme(defaultTheme);
  }

  // 팔레트 색상 조회 헬퍼
  resolvePalette(colorName) {
    if (colors && colors[colorName] && typeof colors[colorName] === 'object') {
      return colors[colorName];
    }
    if (customColors && customColors[colorName]) {
      const hex = customColors[colorName];
      return { 500: hex, base: hex };
    }
    return { 500: colorName };
  }

  // 서버(server.js)에 색상 등록 요청
  async registerColorToServer(colorName) {
    if (!colorName || colorName.startsWith('—')) return { success: false, message: '유효하지 않은 색상입니다.' };
    try {
      const response = await fetch(`/save-color?color=${colorName}`);
      const text = await response.text();
      return { success: response.ok, message: text };
    } catch (error) {
      // 배포 환경(정적 호스팅) 또는 로컬 서버 미실행 시 안내 메시지
      return {
        success: false,
        message: '로컬 개발 서버(node server.js)가 실행되지 않았거나 배포 환경입니다. 로컬 환경에서만 파일 직접 저장이 지원됩니다.',
      };
    }
  }

  // W3C DTCG 표준 및 구체적 스타일 토큰이 포함된 JSON 파일 다운로드
  exportThemeJSON() {
    const primaryPalette = this.resolvePalette(this.theme.primaryColor);
    const secondaryPalette = this.resolvePalette(this.theme.secondaryColor);
    const neutralPalette = this.resolvePalette(this.theme.neutralColor || 'slate');

    const radiusMap = {
      none: '0px',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      full: '9999px',
    };
    const radiusValue = radiusMap[this.theme.borderRadius] || '0.375rem';

    const formatColorShades = (palette) => {
      const shades = {};
      if (typeof palette === 'object' && palette !== null) {
        Object.entries(palette).forEach(([key, val]) => {
          shades[key] = { value: String(val), type: 'color' };
        });
      }
      return shades;
    };

    const payload = {
      $schema: 'https://design-tokens.github.io/community-group/format/',
      name: this.theme.name,
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      // 1. winhub 테마 설정 (내부 호환 및 재불러오기용)
      config: { ...this.theme },
      // 2. W3C DTCG 표준 디자인 토큰
      tokens: {
        color: {
          primary: {
            name: { value: this.theme.primaryColor, type: 'string' },
            shades: formatColorShades(primaryPalette),
          },
          secondary: {
            name: { value: this.theme.secondaryColor, type: 'string' },
            shades: formatColorShades(secondaryPalette),
          },
          neutral: {
            name: { value: this.theme.neutralColor || 'slate', type: 'string' },
            shades: formatColorShades(neutralPalette),
          },
        },
        borderRadius: {
          token: { value: this.theme.borderRadius, type: 'string' },
          value: { value: radiusValue, type: 'dimension' },
        },
        duration: {
          value: { value: `${this.theme.animationDuration || 300}ms`, type: 'duration' },
        },
        density: {
          value: { value: this.theme.density || 'comfortable', type: 'string' },
        },
      },
      // 3. CSS 변수 스니펫 (타 프로젝트 즉시 복사/붙여넣기용)
      cssVariables: {
        '--color-primary-500': primaryPalette['500'] || primaryPalette.base || this.theme.primaryColor,
        '--color-secondary-500': secondaryPalette['500'] || secondaryPalette.base || this.theme.secondaryColor,
        '--border-radius': radiusValue,
        '--transition-duration': `${this.theme.animationDuration || 300}ms`,
      },
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `theme-${this.theme.name.toLowerCase().replace(/\s+/g, '-')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  // 테마 JSON 파일 불러오기 (Import)
  importThemeJSON(importedData) {
    if (!importedData || typeof importedData !== 'object') return null;
    const themeConfig = importedData.config || importedData;
    if (typeof themeConfig !== 'object') return null;

    const nextTheme = {
      ...this.theme,
      ...(themeConfig.name ? { name: themeConfig.name } : {}),
      ...(themeConfig.primaryColor ? { primaryColor: themeConfig.primaryColor } : {}),
      ...(themeConfig.secondaryColor ? { secondaryColor: themeConfig.secondaryColor } : {}),
      ...(themeConfig.neutralColor ? { neutralColor: themeConfig.neutralColor } : {}),
      ...(themeConfig.borderRadius ? { borderRadius: themeConfig.borderRadius } : {}),
      ...(themeConfig.density ? { density: themeConfig.density } : {}),
      ...(themeConfig.animationDuration ? { animationDuration: themeConfig.animationDuration } : {}),
      ...(themeConfig.mode ? { mode: themeConfig.mode } : {}),
    };

    this.setTheme(nextTheme);
    return nextTheme;
  }
}

export const themeStore = new ThemeStore();
