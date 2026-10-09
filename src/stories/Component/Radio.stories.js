// Radio.stories.js
import { createRadio } from './Radio';
import { themeStore } from '../themeStore';

export default {
  title: 'Theme Builder/Components/Radio',
  component: createRadio,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
**Radio 컴포넌트**는 Theme Builder의 전역 테마(Primary Color, Border Radius)를 **자동으로 상속**받습니다.  
기본 표준 라디오뿐만 아니라, **라디오 인풋을 숨기고 커스텀 SVG 인디케이터, 아바타 이미지, 카드형 플랜 셀렉터**로 렌더링할 수 있는 확장 옵션을 완벽히 지원합니다.
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
      description: '라디오 표시 형태 (default: 표준 인풋, svg: 커스텀 SVG 인디케이터, image: 아바타 이미지 셀렉터, card: 카드형 플랜)',
      table: { category: '🎨 Display & Custom' },
    },
    customIcon: {
      name: 'customIcon (SVG 프리셋)',
      control: 'select',
      options: ['dot', 'check', 'star'],
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
      description: '라디오 버튼 라벨 텍스트',
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
      description: '라디오 버튼 및 텍스트 크기',
      table: { category: '🧩 Content & Size' },
    },

    // ⚡ 3. 상태 제어 (State)
    checked: {
      control: 'boolean',
      description: '선택(체크) 활성화 여부',
      table: { category: '⚡ State (상태 제어)' },
    },
    disabled: {
      control: 'boolean',
      description: '라디오 버튼 비활성화 여부',
      table: { category: '⚡ State (상태 제어)' },
    },

    // ⚙️ 4. 이벤트
    onClick: {
      action: 'clicked',
      description: '선택 변경 시 발생하는 이벤트 핸들러',
      table: { category: '⚙️ Events' },
    },
  },
  args: {
    customType: 'default',
    customIcon: 'dot',
    label: '옵션 1 선택',
    description: '가장 널리 사용되는 기본 옵션입니다.',
    size: 'medium',
    checked: false,
    disabled: false,
  },
};

const Template = (args) => {
  const container = document.createElement('div');
  container.className = 'p-6 max-w-xl w-full flex flex-col items-start gap-4';
  container.style.cssText = 'padding: 24px; max-width: 560px; width: 100%; box-sizing: border-box;';

  const radio = createRadio(args);
  container.appendChild(radio);
  return container;
};

// 1. 기본 브라우저 라디오
export const Default = Template.bind({});
Default.args = {
  customType: 'default',
  label: '표준 브라우저 라디오 버튼',
  checked: false,
};

// 2. 커스텀 SVG 인디케이터 (원형 닷)
export const CustomSvgRadio = Template.bind({});
CustomSvgRadio.args = {
  customType: 'svg',
  customIcon: 'dot',
  label: '모던 SVG 원형 라디오',
  description: '선택 시 전역 Primary Color와 함께 부드러운 스케일 애니메이션이 적용됩니다.',
  checked: true,
};

// 3. 커스텀 SVG 체크마크 라디오
export const CustomCheckRadio = Template.bind({});
CustomCheckRadio.args = {
  customType: 'svg',
  customIcon: 'check',
  label: 'SVG 체크마크 라디오',
  description: '원형 테두리 안에 선명한 화이트 체크마크가 표시됩니다.',
  checked: true,
};

// 4. 커스텀 이미지/아바타 셀렉터 (프로필 선택)
export const CustomImageSelector = Template.bind({});
CustomImageSelector.args = {
  customType: 'image',
  imageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  label: '김지훈 (팀 리드)',
  description: '선택 시 테마 링과 체크 뱃지가 즉각 활성화됩니다.',
  checked: true,
};

// 5. 커스텀 요금제/플랜 선택 카드 (Card)
// 5. 커스텀 요금제/플랜 선택 카드 (Card)
export const CustomPlanCard = Template.bind({});
CustomPlanCard.args = {
  customType: 'card',
  customIcon: 'dot',
  imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=200&h=200&q=80',
  label: '프로페셔널 비즈니스 플랜 ($29/월)',
  description: '고급 데이터 분석 대시보드 및 팀 협업 도구 전면 제공',
  checked: true,
};

// 6. 상호 배타적 라디오 그룹 예시 (Radio Group)
export const InteractiveGroup = () => {
  const container = document.createElement('div');
  container.className = 'p-6 max-w-lg w-full space-y-3.5';

  const groupHeader = document.createElement('div');
  groupHeader.className = 'mb-3';
  groupHeader.innerHTML = `
    <h4 class="text-sm font-bold text-gray-900 dark:text-white">배송 옵션 선택 (단일 선택)</h4>
    <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">원하시는 수령 방식을 선택해 주세요.</p>
  `;
  container.appendChild(groupHeader);

  const options = [
    { label: '일반 택배 배송', desc: '영업일 기준 2~3일 소요 (전국 무료 배송)', checked: false },
    { label: '당일 특급 배송', desc: '오후 2시 이전 주문 시 오늘 저녁 도착 (+3,000원)', checked: false },
    { label: '새벽 배송', desc: '내일 아침 7시 전 문 앞 안전 배송 (+4,500원)', checked: true },
  ];

  options.forEach((opt, idx) => {
    const radioEl = createRadio({
      customType: 'card',
      customIcon: 'dot',
      name: 'shipping-option',
      id: `shipping-${idx}`,
      label: opt.label,
      description: opt.desc,
      checked: opt.checked,
    });
    container.appendChild(radioEl);
  });

  return container;
};
