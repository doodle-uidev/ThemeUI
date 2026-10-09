// Checkbox.stories.js
import { createCheckbox } from './Checkbox';
import { themeStore } from '../themeStore';

export default {
  title: 'Theme Builder/Components/Checkbox',
  component: createCheckbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
**Checkbox 컴포넌트**는 Theme Builder의 전역 테마(Primary Color, Border Radius)를 **자동으로 상속**받습니다.  
기본 표준 체크박스뿐만 아니라, **체크박스를 숨기고 커스텀 SVG 아이콘, 썸네일 이미지, 카드형 셀렉터**로 렌더링할 수 있는 확장 옵션을 완벽히 지원합니다.
        `,
      },
    },
  },
  argTypes: {
    // 🎨 1. 렌더링 형태 (Custom Display)
    customType: {
      name: 'customType (렌더링 모드)',
      control: 'select',
      options: ['default', 'svg', 'image', 'card'],
      description: '체크박스 표시 형태 (default: 표준 인풋, svg: 커스텀 SVG 아이콘, image: 이미지 셀렉터, card: 카드형)',
      table: { category: '🎨 Display & Custom' },
    },
    customIcon: {
      name: 'customIcon (SVG 프리셋)',
      control: 'select',
      options: ['check', 'star', 'heart', 'bookmark'],
      description: 'customType이 svg 또는 card일 때 표시될 SVG 아이콘',
      if: { arg: 'customType', neq: 'default' },
      table: { category: '🎨 Display & Custom' },
    },
    imageUrl: {
      name: 'imageUrl (이미지 URL)',
      control: 'text',
      description: 'customType이 image 또는 card일 때 표시될 이미지 경로',
      if: { arg: 'customType', neq: 'default' },
      table: { category: '🎨 Display & Custom' },
    },

    // 🧩 2. 컨텐츠 및 크기
    label: {
      control: 'text',
      description: '체크박스 라벨 텍스트',
      table: { category: '🧩 Content & Size' },
    },
    description: {
      control: 'text',
      description: '보조 설명 텍스트 (svg/image/card 모드에서 지원)',
      table: { category: '🧩 Content & Size' },
    },
    size: {
      control: { type: 'inline-radio' },
      options: ['small', 'medium', 'large'],
      description: '체크박스 및 텍스트 크기',
      table: { category: '🧩 Content & Size' },
    },

    // ⚡ 3. 상태 제어 (State)
    checked: {
      control: 'boolean',
      description: '체크 활성화 여부',
      table: { category: '⚡ State (상태 제어)' },
    },
    disabled: {
      control: 'boolean',
      description: '체크박스 비활성화 여부',
      table: { category: '⚡ State (상태 제어)' },
    },

    // ⚙️ 4. 이벤트
    onClick: {
      action: 'clicked',
      description: '클릭 시 발생하는 이벤트 핸들러',
      table: { category: '⚙️ Events' },
    },
  },
  args: {
    customType: 'default',
    customIcon: 'check',
    label: '서비스 알림 수신 동의',
    description: '이메일 및 SMS로 주요 공지사항을 받습니다.',
    size: 'medium',
    checked: false,
    disabled: false,
  },
};

const Template = (args) => {
  const container = document.createElement('div');
  container.className = 'p-6 max-w-xl w-full flex flex-col items-start gap-4';
  container.style.cssText = 'padding: 24px; max-width: 560px; width: 100%; box-sizing: border-box;';

  const checkbox = createCheckbox(args);
  container.appendChild(checkbox);
  return container;
};

// 1. 기본 브라우저 체크박스
export const Default = Template.bind({});
Default.args = {
  customType: 'default',
  label: '표준 브라우저 체크박스',
  checked: false,
};

// 2. 커스텀 SVG 아이콘 (체크마크)
export const CustomSvgIcon = Template.bind({});
CustomSvgIcon.args = {
  customType: 'svg',
  customIcon: 'check',
  label: '커스텀 SVG 체크박스',
  description: '체크 시 전역 테마 컬러와 함께 부드러운 스케일 애니메이션이 적용됩니다.',
  checked: true,
};

// 3. 커스텀 SVG 아이콘 (별표 / 즐겨찾기 모드)
export const StarBookmarkIcon = Template.bind({});
StarBookmarkIcon.args = {
  customType: 'svg',
  customIcon: 'star',
  label: '즐겨찾기 항목으로 등록',
  description: '클릭하여 별표 북마크를 토글할 수 있습니다.',
  checked: true,
};

// 4. 커스텀 이미지 셀렉터 (아바타/썸네일 선택)
export const CustomImageSelector = Template.bind({});
CustomImageSelector.args = {
  customType: 'image',
  imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  label: '사라 코너 (수석 디자이너)',
  description: '프로젝트 담당자로 배정하려면 클릭하세요.',
  checked: true,
};

// 5. 커스텀 카드형 셀렉터 (Card)
export const CustomCardSelector = Template.bind({});
CustomCardSelector.args = {
  customType: 'card',
  customIcon: 'check',
  imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
  label: '엔터프라이즈 프리미엄 플랜',
  description: '무제한 프로젝트 생성 및 24/7 전담 기술 지원 제공',
  checked: true,
};
