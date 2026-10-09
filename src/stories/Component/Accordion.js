// src/stories/Component/Accordion.js
import { themeStore } from '../themeStore';

let accordionUniqueId = 0;

/**
 * 아코디언 아이템 열기 함수
 */
export const openAccordionItem = (
  triggerEl,
  bodyEl,
  iconEl,
  innerEl,
  activeClasses,
  inactiveClasses,
  duration = 300
) => {
  if (!triggerEl || !bodyEl) return;

  triggerEl.setAttribute('aria-expanded', 'true');
  bodyEl.setAttribute('aria-hidden', 'false');

  // 활성/비활성 클래스 토글
  inactiveClasses.forEach((c) => triggerEl.classList.remove(c));
  activeClasses.forEach((c) => triggerEl.classList.add(c));

  // 화살표 180도 회전 애니메이션
  if (iconEl) {
    iconEl.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    iconEl.style.transform = 'rotate(180deg)';
    iconEl.classList.add('rotate-180');
  }

  // 본문 높이(0fr -> 1fr) 및 페이드인 애니메이션
  bodyEl.classList.remove('hidden');
  bodyEl.style.transition = `grid-template-rows ${duration}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
  bodyEl.style.gridTemplateRows = '1fr';
  bodyEl.style.opacity = '1';

  // 내부 컨텐츠 미세 슬라이드 애니메이션
  if (innerEl) {
    innerEl.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    innerEl.style.transform = 'translateY(0px)';
  }
};

/**
 * 아코디언 아이템 닫기 함수
 */
export const closeAccordionItem = (
  triggerEl,
  bodyEl,
  iconEl,
  innerEl,
  activeClasses,
  inactiveClasses,
  duration = 300
) => {
  if (!triggerEl || !bodyEl) return;

  triggerEl.setAttribute('aria-expanded', 'false');
  bodyEl.setAttribute('aria-hidden', 'true');

  // 활성/비활성 클래스 토글
  activeClasses.forEach((c) => triggerEl.classList.remove(c));
  inactiveClasses.forEach((c) => triggerEl.classList.add(c));

  // 화살표 0도 역회전 애니메이션
  if (iconEl) {
    iconEl.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    iconEl.style.transform = 'rotate(0deg)';
    iconEl.classList.remove('rotate-180');
  }

  // 본문 높이(1fr -> 0fr) 및 페이드아웃 애니메이션
  bodyEl.style.transition = `grid-template-rows ${duration}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
  bodyEl.style.gridTemplateRows = '0fr';
  bodyEl.style.opacity = '0';

  // 내부 컨텐츠 미세 슬라이드 애니메이션
  if (innerEl) {
    innerEl.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    innerEl.style.transform = 'translateY(-6px)';
  }
};

/**
 * 아코디언 아이템 토글 함수
 */
export const toggleAccordionItem = (triggerEl, duration = 300) => {
  const targetSelector = triggerEl.getAttribute('data-accordion-target');
  if (!targetSelector) return;

  const accordionContainer = triggerEl.closest('[data-accordion]');
  const targetBody = accordionContainer
    ? accordionContainer.querySelector(targetSelector) || document.querySelector(targetSelector)
    : document.querySelector(targetSelector);
  if (!targetBody) return;

  const isAlwaysOpen =
    accordionContainer?.getAttribute('data-accordion') === 'open' ||
    accordionContainer?.dataset.alwaysOpen === 'true';

  const isExpanded = triggerEl.getAttribute('aria-expanded') === 'true';
  const icon = triggerEl.querySelector('[data-accordion-icon]');
  const inner = targetBody.querySelector('.accordion-content-inner');

  const activeClasses = (accordionContainer?.getAttribute('data-active-classes') || '')
    .split(' ')
    .filter(Boolean);
  const inactiveClasses = (accordionContainer?.getAttribute('data-inactive-classes') || '')
    .split(' ')
    .filter(Boolean);

  if (isExpanded) {
    // 닫기 실행
    closeAccordionItem(triggerEl, targetBody, icon, inner, activeClasses, inactiveClasses, duration);
  } else {
    // collapse 모드인 경우: 동일 아코디언 내의 다른 열려 있는 아이템들을 부드럽게 닫기
    if (!isAlwaysOpen && accordionContainer) {
      const otherTriggers = accordionContainer.querySelectorAll('[data-accordion-target]');
      otherTriggers.forEach((otherTrigger) => {
        if (otherTrigger !== triggerEl && otherTrigger.getAttribute('aria-expanded') === 'true') {
          const otherSelector = otherTrigger.getAttribute('data-accordion-target');
          const otherBody = otherSelector
            ? accordionContainer.querySelector(otherSelector) || document.querySelector(otherSelector)
            : null;
          const otherIcon = otherTrigger.querySelector('[data-accordion-icon]');
          const otherInner = otherBody?.querySelector('.accordion-content-inner');
          if (otherBody) {
            closeAccordionItem(
              otherTrigger,
              otherBody,
              otherIcon,
              otherInner,
              activeClasses,
              inactiveClasses,
              duration
            );
          }
        }
      });
    }

    // 열기 실행
    openAccordionItem(triggerEl, targetBody, icon, inner, activeClasses, inactiveClasses, duration);
  }
};

/**
 * 전역 이벤트 위임: 캡처 단계에서 이벤트를 가로채 Flowbite의 hidden 강제 삽입을 차단하고 부드러운 애니메이션 실행
 */
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (!window.__accordionAnimationInitialized) {
    window.__accordionAnimationInitialized = true;

    document.addEventListener(
      'click',
      (e) => {
        const trigger = e.target.closest('[data-accordion-target]');
        if (!trigger) return;

        const accordion = trigger.closest('[data-accordion]');
        if (!accordion) return;

        // Flowbite의 hidden 처리 차단 및 자체 애니메이션 실행
        e.preventDefault();
        e.stopImmediatePropagation();

        const duration = parseInt(accordion.getAttribute('data-duration') || '300', 10);
        toggleAccordionItem(trigger, duration);
      },
      true // useCapture = true (캡처 단계에서 실행)
    );
  }
}

/**
 * Accordion HTML 생성 함수
 * @param {Object} options
 * @param {Array} options.items - 아코디언 항목 데이터 [{ title, contents, isOpen }]
 * @param {string|null} options.baseColor - 테마 색상 (미지정 시 테마빌더 전역 Primary Color 상속)
 * @param {string|null} options.borderRadius - 모서리 둥글기 (미지정 시 테마빌더 전역 Radius 상속)
 * @param {'flush'|'boxed'} options.variant - 스타일 형태 ('flush': 구분선형, 'boxed': 카드 박스형)
 * @param {boolean} options.alwaysOpen - 다중 열림 허용 여부
 * @param {number|null} options.animationDuration - 애니메이션 지속 시간 (ms, 미지정 시 전역 모션 상속)
 * @param {string|null} options.id - 고유 식별자 ID
 */
export const createAccordion = ({
  items = [],
  baseColor = null,
  borderRadius = null,
  variant = 'flush',
  alwaysOpen = false,
  animationDuration = null,
  id = null,
}) => {
  accordionUniqueId += 1;
  const accordionId = id || `accordion-${Date.now()}-${accordionUniqueId}`;

  // 전역 테마 토큰 상속 및 폴백
  const activeTheme = themeStore.getActiveTheme();
  const effectiveColor = baseColor || activeTheme.primaryColor || 'blue';
  const effectiveRadius = borderRadius || activeTheme.borderRadius || 'md';
  const effectiveDuration = animationDuration ?? activeTheme.animationDuration ?? 300;

  // 곡률 매핑 및 안전 패딩 계산
  // full(캡슐) 곡률일 때 9999px 대신 헤더 높이(약 56px) 절반인 28px을 부여하여,
  // 접혔을 때는 완벽한 캡슐(알약) 형태를 유지하고,
  // 펼쳐졌을 때는 상단 28px, 하단 28px만 둥글고 좌우 기둥은 수직 직선으로 시원하게 벌어지도록 처리 (텍스트 잘림 원천 차단)
  const isFullRadius = effectiveRadius === 'full';
  const radiusClass = isFullRadius
    ? 'rounded-[28px]'
    : effectiveRadius === 'none'
    ? 'rounded-none'
    : `rounded-${effectiveRadius}`;

  const inlineRadiusStyle = isFullRadius ? 'border-radius: 28px;' : '';
  const paddingXClass = isFullRadius ? 'px-6 md:px-7' : effectiveRadius === 'lg' ? 'px-5' : 'px-4';

  // 색상 클래스 정의
  const activeColorClass = `text-${effectiveColor}-600`;
  const darkBgColorClass = `dark:bg-${effectiveColor}-950`;
  const darkFocusTxtColorClass = `dark:text-${effectiveColor}-100`;

  const activeClasses = `bg-white ${darkBgColorClass} ${activeColorClass} ${darkFocusTxtColorClass}`;
  const inactiveClasses = `text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white`;

  const isBoxed = variant === 'boxed';

  return `
    <div 
      id="${accordionId}" 
      data-accordion="${alwaysOpen ? 'open' : 'collapse'}" 
      data-always-open="${alwaysOpen ? 'true' : 'false'}"
      data-duration="${effectiveDuration}"
      data-active-classes="${activeClasses}" 
      data-inactive-classes="${inactiveClasses}"
      class="w-full select-none ${isBoxed ? 'space-y-3' : ''}"
    >
      ${items
        .map((item, index) => {
          // 명시적으로 isOpen이 설정되어 있으면 사용, 없으면 첫 번째 아이템 기본 오픈
          const isOpen = typeof item.isOpen === 'boolean' ? item.isOpen : index === 0;

          // 콘텐츠 HTML 생성
          const contents = Array.isArray(item.contents) ? item.contents : [item.contents || ''];
          const contentHTML = contents
            .map(
              (content) =>
                `<p class="mb-2 text-gray-500 dark:text-gray-400 last:mb-0 leading-relaxed">${content}</p>`
            )
            .join('');

          // Boxed vs Flush 래퍼 스타일 (isFullRadius 시 28px 인라인 스타일 병행으로 100% 보장)
          const itemWrapperClasses = isBoxed
            ? `border border-gray-200 dark:border-gray-800 ${radiusClass} overflow-hidden shadow-xs bg-white dark:bg-gray-900 transition-all`
            : ``;

          const buttonClasses = isBoxed
            ? `flex items-center justify-between w-full py-4 ${paddingXClass} font-medium rtl:text-right gap-3 transition-colors duration-200 cursor-pointer ${
                isOpen ? activeClasses : inactiveClasses
              }`
            : `flex items-center justify-between w-full py-5 px-3 font-medium rtl:text-right border-b border-gray-200 dark:border-gray-800 gap-3 transition-colors duration-200 cursor-pointer ${
                isOpen ? activeClasses : inactiveClasses
              }`;

          const contentInnerClasses = isBoxed
            ? `accordion-content-inner py-4 ${paddingXClass} border-t border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/60`
            : `accordion-content-inner py-5 px-3 border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/40`;

          return `
            <div class="${itemWrapperClasses}" style="${isBoxed ? inlineRadiusStyle : ''}">
              <h2 id="${accordionId}-heading-${index}" class="m-0">
                <button 
                  type="button" 
                  class="${buttonClasses}" 
                  data-accordion-target="#${accordionId}-body-${index}" 
                  aria-expanded="${isOpen ? 'true' : 'false'}" 
                  aria-controls="${accordionId}-body-${index}"
                >
                  <span class="text-left font-semibold">${item.title}</span>
                  <svg 
                    data-accordion-icon 
                    class="w-3 h-3 shrink-0 ${isOpen ? 'rotate-180' : ''}" 
                    style="transition: transform ${effectiveDuration}ms cubic-bezier(0.4, 0, 0.2, 1); transform: rotate(${
            isOpen ? '180deg' : '0deg'
          });"
                    aria-hidden="true" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 10 6"
                  >
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5" />
                  </svg>
                </button>
              </h2>
              <div 
                id="${accordionId}-body-${index}" 
                class="accordion-body"
                style="display: grid; grid-template-rows: ${
                  isOpen ? '1fr' : '0fr'
                }; opacity: ${isOpen ? '1' : '0'}; transition: grid-template-rows ${effectiveDuration}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${effectiveDuration}ms cubic-bezier(0.4, 0, 0.2, 1);"
                aria-labelledby="${accordionId}-heading-${index}"
                aria-hidden="${isOpen ? 'false' : 'true'}"
              >
                <div class="overflow-hidden">
                  <div 
                    class="${contentInnerClasses}"
                    style="transition: transform ${effectiveDuration}ms cubic-bezier(0.4, 0, 0.2, 1); transform: translateY(${
            isOpen ? '0px' : '-6px'
          });"
                  >
                    ${contentHTML}
                  </div>
                </div>
              </div>
            </div>
          `;
        })
        .join('')}
    </div>
  `;
};