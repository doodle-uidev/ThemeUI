// Dropdown.js
import { themeStore } from '../themeStore';

export const createDropdown = ({
  label = '드롭다운 메뉴',
  items = [],
  customClasses = '',
  id = '',
  baseColor,
  rounded,
  isOpen = false, // Docs 프리뷰용: 기본적으로 펼쳐진 상태 유지 여부
  onSelect,
} = {}) => {
  // Theme Builder 전역 테마 토큰 상속
  const activeTheme = themeStore.getActiveTheme();
  const effectiveColor = baseColor || activeTheme.primaryColor || 'blue';
  const effectiveRadius = rounded || activeTheme.borderRadius || 'lg';

  // 고유 id 생성
  const uniqueId = id || `dropdown-${Math.random().toString(36).substr(2, 8)}`;
  const buttonId = `${uniqueId}-btn`;
  const radiusClass = effectiveRadius === 'full' ? 'rounded-2xl' : `rounded-${effectiveRadius}`;

  // 트리거 버튼 스타일
  const buttonClasses = `inline-flex items-center justify-between text-white bg-${effectiveColor}-600 hover:bg-${effectiveColor}-700 focus:ring-4 focus:outline-none focus:ring-${effectiveColor}-300 font-medium ${radiusClass} text-sm px-5 py-2.5 transition-colors cursor-pointer shadow-sm ${customClasses}`;

  // 재귀적 계층 메뉴 마크업 생성
  const generateItemsHtml = (menuItems, parentId, depth = 0) => {
    return menuItems.map((item, index) => {
      const itemId = `${parentId}-item-${index}`;

      if (item.children && item.children.length > 0) {
        // 계층형 서브메뉴가 있는 항목
        const subDropdownId = `${itemId}-sub`;
        return `
          <li class="relative group/sub w-full">
            <button
              id="${itemId}-btn"
              data-submenu-target="${subDropdownId}"
              type="button"
              class="submenu-toggle flex items-center justify-between w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-${effectiveColor}-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer transition-colors"
            >
              <span class="font-medium">${item.label}</span>
              <svg class="w-3 h-3 ml-2 text-gray-400 group-hover/sub:text-${effectiveColor}-600 transition-transform rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
              </svg>
            </button>
            <!-- 2차 계층 서브메뉴 패널 -->
            <div
              id="${subDropdownId}"
              class="submenu-panel z-30 ${isOpen && depth === 0 ? 'block' : 'hidden'} group-hover/sub:block absolute left-full top-0 ml-1 bg-white divide-y divide-gray-100 ${radiusClass} shadow-xl border border-gray-200 w-48 dark:bg-gray-700 dark:border-gray-600 transition-all"
            >
              <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
                ${generateItemsHtml(item.children, subDropdownId, depth + 1)}
              </ul>
            </div>
          </li>
        `;
      } else {
        // 단일 링크/액션 항목
        return `
          <li class="w-full">
            <a
              href="${item.link || '#'}"
              data-item-label="${item.label}"
              data-index="${index}"
              class="dropdown-menu-item flex items-center justify-between w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-${effectiveColor}-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer transition-colors"
            >
              <span>${item.label}</span>
              ${item.badge ? `<span class="text-xs px-2 py-0.5 rounded-full bg-${effectiveColor}-100 text-${effectiveColor}-800 font-semibold">${item.badge}</span>` : ''}
            </a>
          </li>
        `;
      }
    }).join('\n');
  };

  const itemsHtml = items && items.length > 0 ? generateItemsHtml(items, uniqueId) : '';

  // 컨테이너 생성 및 마크업 삽입
  const container = document.createElement('div');
  container.className = 'dropdown-root-container relative inline-block text-left';
  container.innerHTML = `
    <!-- Main trigger button -->
    <button id="${buttonId}" data-dropdown-toggle="${uniqueId}" class="${buttonClasses}" type="button" aria-expanded="${isOpen}">
      <span>${label}</span>
      <svg class="w-2.5 h-2.5 ml-2.5 transition-transform duration-200 dropdown-arrow" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
      </svg>
    </button>

    <!-- Main dropdown menu -->
    <div
      id="${uniqueId}"
      class="main-dropdown-menu z-20 ${isOpen ? 'block' : 'hidden'} absolute left-0 top-full mt-2 bg-white divide-y divide-gray-100 ${radiusClass} shadow-xl border border-gray-200 w-52 dark:bg-gray-700 dark:border-gray-600 transition-all origin-top-left"
    >
      <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="${buttonId}">
        ${itemsHtml}
      </ul>
    </div>
  `;

  // 요소 참조
  const button = container.querySelector(`#${buttonId}`);
  const menu = container.querySelector(`#${uniqueId}`);
  const arrow = button.querySelector('.dropdown-arrow');

  // 토글 함수
  const toggleDropdown = (show) => {
    const isVisible = show !== undefined ? show : menu.classList.contains('hidden');
    if (isVisible) {
      menu.classList.remove('hidden');
      menu.classList.add('block');
      button.setAttribute('aria-expanded', 'true');
      if (arrow) arrow.style.transform = 'rotate(180deg)';
    } else {
      menu.classList.add('hidden');
      menu.classList.remove('block');
      button.setAttribute('aria-expanded', 'false');
      if (arrow) arrow.style.transform = 'rotate(0deg)';
      // 열려있던 모든 하위 서브메뉴도 닫기
      container.querySelectorAll('.submenu-panel').forEach((sub) => {
        sub.classList.add('hidden');
        sub.classList.remove('block');
      });
    }
  };

  // 메인 버튼 클릭 시 토글
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown();
  });

  // 서브메뉴 클릭/호버 토글 (모바일 터치 및 마우스 완벽 대응)
  container.querySelectorAll('.submenu-toggle').forEach((subBtn) => {
    const targetId = subBtn.getAttribute('data-submenu-target');
    const targetPanel = container.querySelector(`#${targetId}`);

    subBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (targetPanel) {
        const isHidden = targetPanel.classList.contains('hidden');
        targetPanel.classList.toggle('hidden', !isHidden);
        targetPanel.classList.toggle('block', isHidden);
      }
    });
  });

  // 항목 클릭 시 onSelect 호출 및 메뉴 닫기
  container.querySelectorAll('.dropdown-menu-item').forEach((menuItem) => {
    menuItem.addEventListener('click', (e) => {
      const itemLabel = menuItem.getAttribute('data-item-label');
      const index = menuItem.getAttribute('data-index');
      if (typeof onSelect === 'function') {
        onSelect(itemLabel, index);
      }
      if (!isOpen) {
        toggleDropdown(false);
      }
    });
  });

  // 바깥 영역 클릭 시 닫기
  const handleOutsideClick = (e) => {
    if (!container.contains(e.target) && !isOpen) {
      toggleDropdown(false);
    }
  };
  document.addEventListener('click', handleOutsideClick);

  return container;
};

export default createDropdown;
