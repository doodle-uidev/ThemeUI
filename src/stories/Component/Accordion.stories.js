// Accordion.stories.js
import { createAccordion } from './Accordion';
import { themeStore } from '../themeStore';

export default {
  title: 'Theme Builder/Components/Accordion',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
**Accordion 컴포넌트**는 Theme Builder의 전역 테마(Primary Color, Border Radius)를 **자동으로 100% 상속**받습니다.  
Controls 패널에서는 색상이나 곡률 같은 중복 설정 대신, **아코디언 고유의 기능적 속성(스타일 형태, 항목 데이터, 다중 열림 모드, 기본 열림 위치, 모션 속도)**에 집중하여 직관적으로 설정할 수 있습니다.
        `,
      },
    },
  },
  argTypes: {
    // 🧩 1. 디자인 형태 및 컨텐츠
    variant: {
      name: 'variant',
      control: 'inline-radio',
      options: ['flush', 'boxed'],
      description: '아코디언 스타일 형태 (flush: 밑줄 구분선형, boxed: 개별 카드 박스형 - 전역 Radius 적용)',
      table: { category: '🧩 Design & Content' },
    },
    items: {
      name: 'items',
      control: 'object',
      description: '아코디언 항목 데이터 목록 [{ title, contents, isOpen }]',
      table: { category: '🧩 Design & Content' },
    },

    // ⚡ 2. 동작 및 인터랙션 제어 (Behavior)
    alwaysOpen: {
      name: 'alwaysOpen',
      control: 'boolean',
      description: '여러 개를 동시에 열어둘 수 있는지 여부 (false면 하나를 열 때 다른 항목 자동 닫힘)',
      table: { category: '⚡ Behavior (동작 제어)' },
    },
    defaultOpenIndex: {
      name: 'defaultOpenIndex',
      control: { type: 'select' },
      options: [-1, 0, 1, 2],
      description: '최초 로드 시 기본으로 펼쳐둘 항목 번호 (-1: 모두 닫힘, 0: 첫 번째 항목, 1: 두 번째 항목)',
      table: { category: '⚡ Behavior (동작 제어)' },
    },
    animationDuration: {
      name: 'animationDuration (ms)',
      control: { type: 'range', min: 100, max: 1000, step: 50 },
      description: '펼침/접힘 CSS Grid 모션 지속 시간 (ms)',
      table: { category: '⚡ Behavior (동작 제어)' },
    },
  },
  args: {
    variant: 'flush',
    alwaysOpen: false,
    defaultOpenIndex: 0,
    animationDuration: 300,
  },
};

const sampleItems = [
  {
    title: '아코디언 항목 1: 전역 디자인 토큰 자동 상속',
    contents: [
      'Theme Builder의 전역 Primary Color와 Border Radius가 자동으로 상속되어 일관된 디자인을 유지합니다.',
      '별도로 색상이나 곡률을 컴포넌트마다 지정하지 않아도 전역 설정에 따라 즉시 반영됩니다.'
    ]
  },
  {
    title: '아코디언 항목 2: CSS Grid 애니메이션 엔진',
    contents: [
      'open / close 시 높이가 0fr에서 1fr로 스르륵 확장되며, 내부 컨텐츠가 페이드인됩니다.',
      '우측 화살표 아이콘도 180도 부드럽게 회전합니다.'
    ]
  },
  {
    title: '아코디언 항목 3: 접근성 및 반응형 레이아웃',
    contents: [
      '스크린 리더를 위한 aria-expanded, aria-controls 속성이 실시간으로 동기화됩니다.',
      '화면 크기나 텍스트 길이에 구애받지 않고 서브픽셀 단위로 정확하게 펼쳐집니다.'
    ]
  },
];

const Template = (args) => {
  const { items = sampleItems, defaultOpenIndex = 0, ...rest } = args;

  // defaultOpenIndex 반영 (사용자가 각 항목별로 isOpen을 수동 지정하지 않았을 때)
  const processedItems = items.map((item, index) => {
    if (typeof item.isOpen === 'boolean') return item;
    return {
      ...item,
      isOpen: defaultOpenIndex === -1 ? false : index === defaultOpenIndex,
    };
  });

  return createAccordion({
    items: processedItems,
    ...rest,
  });
};

// 1. 기본형 (Flush 스타일)
export const Default = Template.bind({});
Default.args = {
  variant: 'flush',
  alwaysOpen: false,
  defaultOpenIndex: 0,
  animationDuration: 300,
  items: sampleItems,
};

// 2. 카드 박스형 (Boxed 스타일 - 전역 Radius 자동 적용)
export const BoxedVariant = Template.bind({});
BoxedVariant.args = {
  variant: 'boxed',
  alwaysOpen: false,
  defaultOpenIndex: 0,
  animationDuration: 300,
  items: sampleItems,
};

// 3. 다중 열림 모드 (Always Open)
export const AlwaysOpenMode = Template.bind({});
AlwaysOpenMode.args = {
  variant: 'flush',
  alwaysOpen: true,
  defaultOpenIndex: 0,
  animationDuration: 300,
  items: [
    {
      title: '다중 열림 섹션 A',
      contents: ['여러 항목을 동시에 펼쳐두고 문서를 비교하며 읽을 수 있습니다.']
    },
    {
      title: '다중 열림 섹션 B',
      contents: ['다른 섹션을 클릭해도 이 섹션이 닫히지 않고 함께 열려 있습니다.']
    },
    {
      title: '다중 열림 섹션 C',
      contents: ['독립적인 토글 동작을 지원합니다.']
    }
  ],
};

// 4. 최초 전체 닫힘 모드
export const AllCollapsed = Template.bind({});
AllCollapsed.args = {
  variant: 'boxed',
  alwaysOpen: false,
  defaultOpenIndex: -1,
  animationDuration: 300,
  items: sampleItems,
};

// 5. 슬로우 모션 (600ms)
export const SmoothSlowMotion = Template.bind({});
SmoothSlowMotion.args = {
  variant: 'boxed',
  alwaysOpen: false,
  defaultOpenIndex: 0,
  animationDuration: 600,
  items: sampleItems,
};