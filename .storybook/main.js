// main.js
/** @type { import('@storybook/html-vite').StorybookConfig } */
import colors from 'tailwindcss/colors';
import path from 'path';

// Tailwind 색상 목록 자동 생성
const tailwindColorList = Object.keys(colors)
  .filter(color => typeof colors[color] === 'object') // 중첩된 색상만 필터링
  .flatMap(color => 
    Object.keys(colors[color])
      .filter(shade => !isNaN(shade)) // 숫자 값(100, 200...)만 선택
      .map(shade => `bg-${color}-${shade}`)
  );

// Storybook 설정
const config = {
  staticDirs: [path.resolve(__dirname, '../src/main/resources/static')],
  stories: [
    "../src/stories/**/*.mdx",
    "../src/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    {
      name: "@storybook/addon-essentials",
      options: {
        docs: true // MDX 문서 활성화
      }
    },
    '@storybook/addon-links',
    "@storybook/addon-interactions"
  ],
  framework: {
    name: "@storybook/html-vite",
    options: {}
  },
  viteFinal: async (config) => {
    config.server = {
      proxy: {
        '/save-color': {
          target: 'http://localhost:3000', // 요청을 localhost:3000으로 리디렉션
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/save-color/, '/save-color'), // 경로 수정
        },
      },
    };
    // 최적화 제외 추가
    config.optimizeDeps = {
      exclude: ['@storybook/addon-docs'], // DocsRenderer 관련 문제 해결
    };
    return config;
  },
  
  argTypes: {
    backgroundColor: {
      control: { type: 'select' },
      options: tailwindColorList, // Tailwind 색상 목록 자동 로드
    },
  }
};

module.exports = config;
