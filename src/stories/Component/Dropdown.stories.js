// Dropdown.stories.js
import { createDropdown } from './Dropdown';
import { themeStore } from '../themeStore';

export default {
  title: 'Theme Builder/Components/Dropdown',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
**Dropdown 컴포넌트**는 Theme Builder의 전역 Primary Color와 Border Radius를 **자동으로 상속**받습니다.  
Docs 페이지에서는 메뉴를 직접 클릭하여 여닫는 **인터랙티브 모드**와, 하위 메뉴 및 서브메뉴의 레이아웃을 즉시 확인할 수 있는 **펼침 미리보기(isOpen)**를 제공합니다.
        `,
      },
    },
  },
  argTypes: {
    // 🧩 1. 컨텐츠 및 메뉴 데이터
    label: {
      control: 'text',
      description: '드롭다운 트리거 버튼 텍스트',
      table: { category: '🧩 Content & Data' },
    },
    items: {
      control: 'object',
      description: '드롭다운 메뉴 목록 데이터 (계층형 서브메뉴 지원)',
      table: { category: '🧩 Content & Data' },
    },

    // 📐 2. 레이아웃 & 표시 모드
    isOpen: {
      control: 'boolean',
      description: '하위 메뉴를 펼친 상태로 유지 (Docs 실시간 구조 확인용)',
      table: { category: '📐 Layout & Display' },
    },

    // ⚙️ 3. 이벤트
    onSelect: {
      action: 'selected',
      description: '메뉴 항목 클릭 시 호출되는 콜백 함수',
      table: { category: '⚙️ Events' },
    },
  },
  args: {
    label: '사용자 메뉴',
    isOpen: false,
    items: [
      { label: '내 프로필', link: '#' },
      { label: '보안 및 계정 관리', link: '#' },
      {
        label: '환경 설정 (서브메뉴)',
        children: [
          { label: '알림 수신 설정', link: '#' },
          { label: '언어 및 국가 변경', link: '#' },
          { label: '디스플레이 모드', link: '#' },
        ],
      },
      { label: '로그아웃', link: '#' },
    ],
  },
};

const Template = (args) => {
  const container = document.createElement('div');
  container.className = 'p-6 flex flex-col items-start min-h-[380px] w-full';

  // 드롭다운 엘리먼트 생성
  const dropdownElement = createDropdown({
    ...args,
    onSelect: (label, index) => {
      if (args.onSelect) {
        args.onSelect({ label, index });
      }
    },
  });

  container.appendChild(dropdownElement);
  return container;
};

// 1. 기본 계층형 드롭다운 (버튼 클릭 시 메뉴 전개 + 하위 서브메뉴 호버/클릭 지원)
export const Default = Template.bind({});
Default.args = {
  label: '사용자 메뉴',
  isOpen: false,
  items: [
    { label: '내 프로필', link: '#' },
    { label: '보안 및 인증', link: '#' },
    {
      label: '환경 설정',
      children: [
        { label: '알림 설정', link: '#' },
        { label: '언어 및 지역', link: '#' },
        { label: '데이터 백업', link: '#' },
      ],
    },
    { label: '로그아웃', link: '#' },
  ],
};

// 2. Docs 실물 확인용 펼침 상태 (하위 메뉴 및 2단계 서브메뉴 즉시 노출)
export const ExpandedPreview = Template.bind({});
ExpandedPreview.args = {
  label: '계층 메뉴 미리보기',
  isOpen: true,
  items: [
    { label: '대시보드 홈', link: '#' },
    {
      label: '팀 및 멤버 관리',
      children: [
        { label: '팀원 초대', link: '#' },
        { label: '권한 및 역할 배정', link: '#' },
      ],
    },
    {
      label: '시스템 설정',
      children: [
        { label: 'API 키 관리', link: '#' },
        { label: '웹훅(Webhook) 연동', link: '#' },
      ],
    },
    { label: '결제 및 요금제', link: '#' },
  ],
};

// 3. 단순 단일 레벨 액션 목록
export const SimpleActions = Template.bind({});
SimpleActions.args = {
  label: '작업 선택',
  isOpen: false,
  items: [
    { label: '새 프로젝트 생성', link: '#' },
    { label: '엑셀 데이터 내보내기', link: '#' },
    { label: '보고서 PDF 다운로드', link: '#' },
  ],
};
