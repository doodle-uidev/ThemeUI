// preview.js
import 'flowbite';
import { initAccordions, initModals, initDropdowns,  } from 'flowbite';
import '../src/main/resources/static/css/common/output.css';
import { addons } from '@storybook/addons';
import { themes } from '@storybook/theming';

export const decorators = [
  (Story, context) => {
    const story = Story();

    // 다크 모드 설정 이동
    const html = document.documentElement;
    if (context.globals.theme === 'dark') {
      html.classList.add('dark');
      addons.setConfig({ theme: themes.dark });
    } else {
      html.classList.remove('dark');
      addons.setConfig({ theme: themes.light });
    }

    // Flowbite 초기화
    setTimeout(() => {
      initAccordions();
      initModals();
      initDropdowns();
    }, 0);

    // Storybook Controls 스위치/라디오 스타일 오염 방지 글로벌 스타일 주입
    if (!document.getElementById('sb-switch-control-fix')) {
      const style = document.createElement('style');
      style.id = 'sb-switch-control-fix';
      style.textContent = `
        input[role="switch"],
        input[role="switch"]:checked,
        .docblock-argstable input[role="switch"],
        .docblock-argstable input[role="switch"]:checked,
        [class*="docblock"] input[role="switch"],
        [class*="docblock"] input[role="switch"]:checked,
        label[for*="control-"] input[type="checkbox"],
        label[for*="control-"] input[type="checkbox"]:checked,
        input[id^="control-"][role="switch"],
        input[id^="control-"][role="switch"]:checked {
          opacity: 0 !important;
          visibility: hidden !important;
          appearance: none !important;
          -webkit-appearance: none !important;
          background-color: transparent !important;
          background-image: none !important;
          border: none !important;
          box-shadow: none !important;
          width: 0 !important;
          height: 0 !important;
          position: absolute !important;
          left: -9999px !important;
          pointer-events: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    return story;
  },
];

const preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light Mode' },
          { value: 'dark', title: 'Dark Mode' },
        ],
      },
    },
  },
};

export default preview;
