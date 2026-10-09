// Tab.stories.js
import { Tab } from './Tab';
import { themeStore } from '../themeStore';

export default {
  title: 'Theme Builder/Components/Tab',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
**Tab 컴포넌트**는 Theme Builder의 전역 Primary Color를 **자동으로 상속**받아 활성 탭의 하단 인디케이터와 배경 하이라이트를 표현합니다.  
Controls 패널에서는 색상 컨트롤 대신, **탭 메뉴 데이터(tabs)와 컨테이너 너비(containerWidth - 초과 시 좌우 화살표 스크롤 지원)**에 집중하여 설정할 수 있습니다.
        `,
      },
    },
  },
  argTypes: {
    // 🧩 1. 탭 데이터 목록
    tabs: {
      control: 'object',
      description: '탭 버튼 라벨 및 패널 내용 데이터 [{ id, label, content }]',
      table: { category: '🧩 Tab Data & Content' },
    },

    // 📐 2. 컨테이너 및 스크롤
    containerWidth: {
      control: 'text',
      description: '탭 컨테이너 가로 제한 너비 (예: 360px). 이 너비를 초과하면 좌우 이동 화살표 버튼이 자동으로 나타납니다.',
      table: { category: '📐 Layout & Scroll' },
    },
  },
  args: {
    containerWidth: '420px',
    tabs: [
      { id: 'tab-overview', label: '개요 (Overview)', content: '시스템의 전반적인 상태와 핵심 지표를 요약하여 보여줍니다.' },
      { id: 'tab-analytics', label: '통계 분석', content: '방문자 수, 트래픽 유입 경로, 전환율 등의 상세 통계 차트를 제공합니다.' },
      { id: 'tab-security', label: '보안 및 권한', content: '2단계 인증(2FA), IP 접속 제한, 권한 그룹 관리 기능을 설정할 수 있습니다.' },
      { id: 'tab-billing', label: '결제 및 요금제', content: '현재 구독 중인 플랜 정보와 결제 수단, 인보이스 내역을 확인합니다.' },
      { id: 'tab-notifications', label: '알림 설정', content: '이메일, SMS, 슬랙 웹훅 알림 발송 조건을 구성합니다.' },
    ],
  },
};

export const DynamicTabs = (args) => {
  const activeColor = themeStore.getActiveTheme().primaryColor || 'blue';

  const tabMarkup = `
    <div class="max-w-xl">
      <div class="mb-2">
        <ul class="flex flex-nowrap text-sm font-medium text-center" role="tablist" id="tab-list">
          ${args.tabs.map((tab, index) => `
            <li role="presentation" key="${index}">
              <button class="inline-block border-b-2 rounded-t-sm" id="${tab.id}-tab" data-tabs-target="#${tab.id}" type="button" role="tab" aria-controls="${tab.id}" aria-selected="false">${tab.label}</button>
            </li>
          `).join('')}
        </ul>
      </div>
      <div id="tab-content" class="mt-3">
        ${args.tabs.map((tab) => `
          <div class="hidden p-5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700" id="${tab.id}" role="tabpanel" aria-labelledby="${tab.id}-tab">
            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">${tab.content}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  const div = document.createElement('div');
  div.innerHTML = tabMarkup;

  setTimeout(() => {
    Tab(div, activeColor, args.containerWidth);
  }, 0);

  return div;
};

// 1. 기본 탭 (너비 초과 시 스크롤 화살표 지원)
export const Default = DynamicTabs.bind({});
Default.args = {
  containerWidth: '380px',
};

// 2. 전체 너비 탭
export const Wide = DynamicTabs.bind({});
Wide.args = {
  containerWidth: '100%',
  tabs: [
    { id: 'tab-1', label: '첫 번째 탭', content: '첫 번째 패널의 내용입니다.' },
    { id: 'tab-2', label: '두 번째 탭', content: '두 번째 패널의 내용입니다.' },
    { id: 'tab-3', label: '세 번째 탭', content: '세 번째 패널의 내용입니다.' },
  ],
};
