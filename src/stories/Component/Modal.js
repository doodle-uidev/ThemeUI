// Modal.js
import { themeStore } from '../themeStore';

export const createModal = ({
  size = 'medium',
  modalLabel = '',
  buttonText = '',
  title = '',
  body = '<p class="text-base leading-relaxed text-gray-600 dark:text-gray-300">서비스 이용을 위해 아래 규정을 검토하신 후 동의해 주시기 바랍니다. 모든 항목은 안전하게 암호화되어 보관됩니다.</p>',
  acceptText = '동의 및 확인',
  declineText = '취소',
  baseColor,
  rounded,
  customClasses = '',
  headerClass = '',
  bodyClass = '',
  footerClass = '',
  inline = false, // Docs 등에서 모달 창 실물을 펼쳐서 바로 볼 수 있는 인라인 모드
} = {}) => {
  // Theme Builder 전역 토큰 상속
  const activeTheme = themeStore.getActiveTheme();
  const effectiveColor = baseColor || activeTheme.primaryColor || 'blue';
  const effectiveRadius = rounded || activeTheme.borderRadius || 'lg';

  // 고유 id 생성 (중복 방지)
  const uniqueId = `modal-${Math.random().toString(36).substr(2, 9)}`;
  const defaultTitle = title || (modalLabel ? modalLabel : '표준 대화상자');
  const defaultBtnText = buttonText || `${defaultTitle} 열기`;

  // 사이즈 설정
  const modalSettings = {
    small: { maxWidth: 'max-w-md' },
    medium: { maxWidth: 'max-w-lg' },
    large: { maxWidth: 'max-w-4xl' },
    extralarge: { maxWidth: 'max-w-7xl' },
  };

  const { maxWidth: modalMaxWidth } = modalSettings[size] || modalSettings.medium;
  const radiusClass = effectiveRadius === 'full' ? 'rounded-3xl' : `rounded-${effectiveRadius}`;

  // 버튼 스타일
  const primaryButtonClasses = `inline-flex items-center justify-center text-white bg-${effectiveColor}-600 hover:bg-${effectiveColor}-700 focus:ring-4 focus:outline-none focus:ring-${effectiveColor}-300 font-medium ${radiusClass} text-sm px-5 py-2.5 transition-colors cursor-pointer shadow-sm`;
  const secondaryButtonClasses = `py-2.5 px-5 text-sm font-medium text-gray-700 bg-white ${radiusClass} border border-gray-300 hover:bg-gray-100 hover:text-${effectiveColor}-700 focus:outline-none cursor-pointer transition-colors dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 shadow-xs`;

  // 모달 내부 대화상자 카드 마크업
  const dialogHtml = `
    <div class="relative bg-white ${radiusClass} shadow-2xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 overflow-hidden w-full transition-all">
      <!-- Modal header -->
      <div class="flex items-center justify-between p-4 md:p-5 border-b border-gray-200 dark:border-gray-700 ${headerClass}">
        <h3 class="text-lg md:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-${effectiveColor}-500 inline-block"></span>
          ${defaultTitle}
        </h3>
        <button type="button" class="modal-close-trigger text-gray-400 bg-transparent hover:bg-gray-100 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-700 dark:hover:text-white cursor-pointer transition-colors" data-modal-hide="${uniqueId}">
          <svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
      </div>
      <!-- Modal body -->
      <div class="p-4 md:p-6 space-y-4 ${bodyClass}">
        ${body}
      </div>
      <!-- Modal footer -->
      <div class="flex items-center justify-end gap-3 p-4 md:p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 ${footerClass}">
        <button data-modal-hide="${uniqueId}" type="button" class="modal-decline-trigger ${secondaryButtonClasses}">${declineText}</button>
        <button data-modal-hide="${uniqueId}" type="button" class="modal-accept-trigger ${primaryButtonClasses}">${acceptText}</button>
      </div>
    </div>
  `;

  // 1. Docs 인라인 뷰 (다이얼로그 실물을 직접 펼쳐서 보여줌)
  if (inline) {
    const inlineContainer = document.createElement('div');
    inlineContainer.className = `w-full ${modalMaxWidth} mx-auto my-4 transition-all`;
    inlineContainer.innerHTML = dialogHtml;
    return inlineContainer;
  }

  // 2. 인터랙티브 모달 래퍼 (버튼 + 팝업 다이얼로그 + 자체 이벤트 바인딩)
  const wrapper = document.createElement('div');
  wrapper.className = 'modal-interactive-container inline-block';
  wrapper.innerHTML = `
    <button type="button" class="modal-open-trigger ${primaryButtonClasses} ${customClasses}" data-modal-target="${uniqueId}">
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      ${defaultBtnText}
    </button>

    <div id="${uniqueId}" tabindex="-1" aria-hidden="true" class="modal-backdrop fixed inset-0 z-50 hidden w-full h-full p-4 overflow-x-hidden overflow-y-auto bg-gray-900/60 backdrop-blur-xs flex items-center justify-center transition-opacity">
      <div class="modal-dialog-box relative w-full ${modalMaxWidth} max-h-[90vh] overflow-y-auto">
        ${dialogHtml}
      </div>
    </div>
  `;

  // 자체 Vanilla JS 모달 오픈/클로즈 이벤트 바인딩 (Flowbite 의존성 없이 100% 무결점 작동)
  const openBtn = wrapper.querySelector('.modal-open-trigger');
  const modalBackdrop = wrapper.querySelector(`#${uniqueId}`);
  const dialogBox = wrapper.querySelector('.modal-dialog-box');

  const openModal = () => {
    modalBackdrop.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modalBackdrop.classList.add('hidden');
    document.body.style.overflow = '';
  };

  openBtn.addEventListener('click', openModal);

  // 닫기 트리거(X 버튼, 취소/확인 버튼)
  wrapper.querySelectorAll(`[data-modal-hide="${uniqueId}"]`).forEach((btn) => {
    btn.addEventListener('click', closeModal);
  });

  // 배경(Backdrop) 클릭 시 닫기
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  // ESC 키 클릭 시 닫기
  const handleKeydown = (e) => {
    if (e.key === 'Escape' && !modalBackdrop.classList.contains('hidden')) {
      closeModal();
    }
  };
  window.addEventListener('keydown', handleKeydown);

  return wrapper;
};

export default createModal;
