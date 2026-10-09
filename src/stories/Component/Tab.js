export const Tab = (element, baseColor = 'blue', containerWidth) => {
  const tabElement = element;
  tabElement.style.position = 'relative';
  const tabButtons = tabElement.querySelectorAll('[role="tab"]');
  const tabContents = tabElement.querySelectorAll('[role="tabpanel"]');
  const currentBaseColor = baseColor;

  // === 1) 스타일 변수 ===
  const styles = {
    defaultBorderClass: 'border-b-gray-200', // TailwindCSS의 gray-300
    activeBorderClass: `border-b-${currentBaseColor}-500`, // baseColor
    borderBottomWidth: 'border-b-2', // TailwindCSS의 border-bottom-width
    darkBorderClass: 'dark:border-b-gray-700', // 다크 모드에서 적용될 클래스
  };

  const baseStyles = {
    tabButton: {
      padding: ['px-4', 'py-2'],
      textColor: 'text-gray-600',
      hoverTextColor: `hover:text-${currentBaseColor}-700`,
      hoverBgColor: `hover:bg-${currentBaseColor}-50`,
      focusTextColor: `focus:text-${currentBaseColor}-800`,
    },
    tabContent: {
      bgColor: `bg-${currentBaseColor}-50`,
      darkBgColor: 'dark:bg-opacity-10',
    },
    tabButtonActive: {
      textColor: `text-${currentBaseColor}-500`,
    },
    tabButtonInactive: {
      textColor: 'text-gray-600',
    },
  };

  // === 2) 탭 리스트(<ul>)를 감싸는 래퍼 생성: 스크롤바 숨기고 화살표를 통한 수평 스크롤 ===
  let tabListWrapper = tabElement.querySelector('#tab-list-wrapper');
  if (!tabListWrapper) {
    tabListWrapper = document.createElement('div');
    tabListWrapper.id = 'tab-list-wrapper';
    tabListWrapper.className = 'relative overflow-hidden';

    if (containerWidth) {
      tabListWrapper.style.width =
        typeof containerWidth === 'number' ? `${containerWidth}px` : containerWidth;
    }

    const ul = tabElement.querySelector('#tab-list');
    ul.classList.add('flex', 'flex-nowrap', 'whitespace-nowrap');
    tabListWrapper.appendChild(ul);

    const parent = tabElement.querySelector('.mb-6') || tabElement.firstElementChild;
    parent.parentNode.insertBefore(tabListWrapper, parent);
  }

  const tabList = tabListWrapper.querySelector('ul');

  // === 3) 좌우 화살표 버튼 생성 ===
  const createArrowButton = (direction) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.innerHTML = direction === 'left' 
      ? `<svg xmlns="http://www.w3.org/2000/svg" height="21px" width="10px" viewBox="0 0 15 26"><polygon fill="currentColor" points="12.885,0.58 14.969,2.664 4.133,13.5 14.969,24.336 12.885,26.42 2.049,15.584 -0.035,13.5 "/></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" height="21px" width="10px" viewBox="0 0 15 26"><polygon fill="currentColor" points="2.115,0.58 0.031,2.664 10.867,13.5 0.031,24.336 2.115,26.42 12.951,15.584 14.965,13.5 "/></svg>`;

    btn.className = 'absolute top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-500 bg-opacity-50 hover:bg-opacity-75 rounded-sm p-2 z-10 hidden';
    btn.style[direction] = '-2.8rem';

    btn.addEventListener('mouseover', () => {
      btn.style.fill = `var(--${currentBaseColor}-500)`;
    });
    btn.addEventListener('mouseout', () => {
      btn.style.fill = 'currentColor';
    });

    return btn;
  };

  let leftArrow = tabElement.querySelector('#left-arrow');
  let rightArrow = tabElement.querySelector('#right-arrow');
  if (!leftArrow) {
    leftArrow = createArrowButton('left');
    leftArrow.id = 'left-arrow';
    tabListWrapper.parentElement.appendChild(leftArrow);
  }
  if (!rightArrow) {
    rightArrow = createArrowButton('right');
    rightArrow.id = 'right-arrow';
    tabListWrapper.parentElement.appendChild(rightArrow);
  }

  // === 4) 스크롤 동작 ===
  function scrollToNextPage() {
    const containerW = tabListWrapper.clientWidth;
    const scrollLeft = tabListWrapper.scrollLeft;
    const scrollMax = tabListWrapper.scrollWidth - containerW;

    let newScrollLeft = scrollLeft + containerW;
    if (newScrollLeft > scrollMax) {
      newScrollLeft = scrollMax;
    }

    alignToClosestTab(newScrollLeft);
  }

  function scrollToPrevPage() {
    const containerW = tabListWrapper.clientWidth;
    const scrollLeft = tabListWrapper.scrollLeft;

    let newScrollLeft = scrollLeft - containerW;
    if (newScrollLeft < 0) {
      newScrollLeft = 0;
    }

    alignToClosestTab(newScrollLeft);
  }

  function alignToClosestTab(targetScrollLeft) {
    const tabs = Array.from(tabListWrapper.querySelectorAll('[role="tab"]'));
    let closestTab = tabs[0];
    let closestOffset = Math.abs(targetScrollLeft - tabs[0].offsetLeft);

    tabs.forEach((tab) => {
      const offset = Math.abs(targetScrollLeft - tab.offsetLeft);
      if (offset < closestOffset) {
        closestTab = tab;
        closestOffset = offset;
      }
    });

    tabListWrapper.scrollTo({
      left: closestTab.offsetLeft,
      behavior: 'smooth',
    });
  }

  rightArrow.addEventListener('click', scrollToNextPage);
  leftArrow.addEventListener('click', scrollToPrevPage);

  const updateArrowVisibility = () => {
    const containerW = tabListWrapper.clientWidth;
    const scrollW = tabListWrapper.scrollWidth;
    const scrollLeft = tabListWrapper.scrollLeft;
    const scrollRight = scrollLeft + containerW;

    if (scrollW <= containerW) {
      leftArrow.style.display = 'none';
      rightArrow.style.display = 'none';
      return;
    }

    leftArrow.style.display = scrollLeft <= 0 ? 'none' : 'block';
    rightArrow.style.display = scrollRight >= scrollW - 1 ? 'none' : 'block';
  };

  tabListWrapper.addEventListener('scroll', updateArrowVisibility);
  window.addEventListener('resize', updateArrowVisibility);
  setTimeout(updateArrowVisibility, 0);

  // === 5) 탭 버튼 및 콘텐츠 스타일 설정 ===
  const setTabStyles = () => {
    tabButtons.forEach((button) => {
      // 기본 상태 스타일 설정
      button.classList.add(styles.borderBottomWidth, styles.defaultBorderClass);
      button.classList.add(...baseStyles.tabButton.padding);
      button.classList.add(
        baseStyles.tabButton.textColor,
        baseStyles.tabButton.hoverTextColor,
        baseStyles.tabButton.hoverBgColor,
        baseStyles.tabButton.focusTextColor
      );
  
      // 다크 모드 스타일 추가
      button.classList.add(styles.darkBorderClass);
    });
  
    tabContents.forEach((content) => {
      content.classList.add(baseStyles.tabContent.bgColor, baseStyles.tabContent.darkBgColor);
    });
  };

  // === 6) 활성화된 탭 버튼 스타일 설정 ===
  const activateTab = (target) => {
    tabButtons.forEach((button) => {
      // 모든 버튼을 기본 상태로 되돌림
      button.setAttribute('aria-selected', 'false');
      button.classList.remove(styles.activeBorderClass);
      button.classList.add(styles.defaultBorderClass);
      button.classList.remove(baseStyles.tabButtonActive.textColor);
      button.classList.add(baseStyles.tabButtonInactive.textColor);
    });

    tabContents.forEach((content) => content.classList.add('hidden'));

    // 클릭된 버튼을 활성화 상태로 설정
    target.setAttribute('aria-selected', 'true');
    target.classList.remove(styles.defaultBorderClass);
    target.classList.add(styles.activeBorderClass);
    target.classList.remove(baseStyles.tabButtonInactive.textColor);
    target.classList.add(baseStyles.tabButtonActive.textColor, 'font-bold');

    const targetContent = tabElement.querySelector(`#${target.getAttribute('aria-controls')}`);
    targetContent.classList.remove('hidden');
  };

  // === 7) 탭 버튼 클릭 이벤트 추가 ===
  tabButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      activateTab(event.target);
    });
  });

  // === 8) 초기 활성화 상태 설정 ===
  if (tabButtons.length > 0) {
    activateTab(tabButtons[0]);
  }

  setTabStyles();

  // === 9) tab-content가 tab-list의 넓이를 공유하도록 설정 ===
  let tabContent = tabElement.querySelector('#tab-content');
  if (!tabContent) {
    tabContent = document.createElement('div');
    tabContent.id = 'tab-content';
  }

  // tab-content는 tab-list와 같은 부모 요소 내에서 위치하도록 함
  const parent = tabListWrapper.parentElement;
  parent.appendChild(tabContent);

  // tab-content의 너비를 tab-list와 동일하게 설정
  tabContent.style.width = `${tabListWrapper.clientWidth}px`;

  const setTabContentWidth = () => {
    tabContent.style.width = `${tabListWrapper.clientWidth}px`;
  };

  window.addEventListener('resize', setTabContentWidth);
  setTimeout(setTabContentWidth, 0);
};

export default Tab;
