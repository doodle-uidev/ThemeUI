// Modal.stories.js
import { createModal } from './Modal';
import { themeStore } from '../themeStore';

export default {
  title: 'Theme Builder/Components/Modal',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
**Modal 컴포넌트**는 Theme Builder의 전역 Primary Color와 Border Radius를 **자동으로 상속**받습니다.  
Docs 페이지에서는 모달 대화상자의 디자인(헤더, 본문, 액션 버튼)을 즉시 확인할 수 있도록 **인라인 프리뷰**와 실제 클릭 시 작동하는 **팝업 트리거**를 함께 제공합니다.
        `,
      },
    },
  },
  argTypes: {
    // 🧩 1. 컨텐츠 데이터
    title: {
      control: 'text',
      description: '모달 헤더 제목',
      table: { category: '🧩 Content (컨텐츠)' },
    },
    body: {
      control: 'text',
      description: '모달 본문 내용 (HTML 허용)',
      table: { category: '🧩 Content (컨텐츠)' },
    },
    buttonText: {
      control: 'text',
      description: '모달을 열기 위한 트리거 버튼 라벨',
      table: { category: '🧩 Content (컨텐츠)' },
    },
    acceptText: {
      control: 'text',
      description: '모달 푸터의 확인/승인 버튼 라벨',
      table: { category: '🧩 Content (컨텐츠)' },
    },
    declineText: {
      control: 'text',
      description: '모달 푸터의 취소/닫기 버튼 라벨',
      table: { category: '🧩 Content (컨텐츠)' },
    },

    // 📐 2. 크기 및 표시 모드
    size: {
      control: 'select',
      options: ['small', 'medium', 'large', 'extralarge'],
      description: '모달 대화상자 너비 크기 (small: 450px, medium: 512px, large: 896px, extralarge: 1280px)',
      table: { category: '📐 Layout & Size' },
    },
    inline: {
      control: 'boolean',
      description: '모달 대화상자 실물을 화면에 바로 펼쳐서 표시 (false 시 팝업 버튼만 표시)',
      table: { category: '📐 Layout & Size' },
    },
  },
  args: {
    title: '표준 대화상자 (Medium)',
    body: '<p class="text-base leading-relaxed text-gray-600 dark:text-gray-300">서비스 이용을 위해 아래 규정을 검토하신 후 동의해 주시기 바랍니다. 모든 항목은 안전하게 암호화되어 보관됩니다.</p>',
    buttonText: '팝업 모달 열기',
    acceptText: '동의 및 확인',
    declineText: '취소',
    size: 'medium',
    inline: true,
  },
};

const Template = (args) => {
  const container = document.createElement('div');
  container.className = 'p-6 flex flex-col items-center justify-center gap-6 w-full';

  // 1. 팝업 테스트용 트리거 모달
  const popupElement = createModal({
    ...args,
    inline: false,
    buttonText: args.buttonText || `${args.title} 팝업 테스트`,
  });

  // 2. 인라인 실물 다이얼로그
  if (args.inline) {
    const previewHeader = document.createElement('div');
    previewHeader.className = 'w-full flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3 mb-2';
    previewHeader.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="text-xs font-semibold uppercase tracking-wider text-gray-400">Preview</span>
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">모달 대화상자 실물 뷰</span>
      </div>
    `;

    const topBar = document.createElement('div');
    topBar.className = 'w-full flex items-center justify-between gap-4';
    topBar.appendChild(popupElement);

    const inlineDialog = createModal({
      ...args,
      inline: true,
    });

    container.appendChild(topBar);
    container.appendChild(previewHeader);
    container.appendChild(inlineDialog);
  } else {
    container.appendChild(popupElement);
  }

  return container;
};

// 1. 기본 중간 크기 모달 (Docs에서 대화상자 실물 즉시 확인 가능)
export const Default = Template.bind({});
Default.args = {
  size: 'medium',
  title: '표준 대화상자 (Medium)',
  buttonText: '팝업 모달 열기',
  inline: true,
};

// 2. 작은 확인 알림창 (Small Alert)
export const SmallAlert = Template.bind({});
SmallAlert.args = {
  size: 'small',
  title: '작업 확인',
  body: '<p class="text-sm text-gray-600 dark:text-gray-300">정말로 변경 사항을 저장하시겠습니까? 저장 후 즉시 반영됩니다.</p>',
  buttonText: 'Small 모달 열기',
  acceptText: '저장',
  declineText: '취소',
  inline: true,
};

// 3. 대형 콘텐츠 모달 (Large Content)
export const LargeContent = Template.bind({});
LargeContent.args = {
  size: 'large',
  title: '시스템 상세 리포트',
  body: `
    <div class="space-y-3 text-sm text-gray-600 dark:text-gray-300">
      <p>대량의 데이터 분석 결과 및 상세 로그를 한눈에 확인할 수 있는 대형 모달 뷰입니다.</p>
      <div class="p-4 bg-gray-50 dark:bg-gray-800/80 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 class="font-bold text-gray-900 dark:text-white mb-2">상태 요약</h4>
        <ul class="list-disc list-inside space-y-1">
          <li>네트워크 응답 속도: 24ms (정상)</li>
          <li>활성 세션 수: 1,420개</li>
          <li>보안 검증: 통과 (SSL 256-bit)</li>
        </ul>
      </div>
    </div>
  `,
  buttonText: 'Large 모달 열기',
  acceptText: '보고서 내보내기',
  declineText: '닫기',
  inline: true,
};

// 4. 순수 팝업 트리거 전용 (PopupOnly)
export const PopupTriggerOnly = Template.bind({});
PopupTriggerOnly.args = {
  size: 'medium',
  title: '팝업 트리거 전용 모달',
  buttonText: '팝업 창 띄우기',
  inline: false,
};
