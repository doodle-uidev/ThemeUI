// src/stories/Component/SideMenu.js
import { colorSystem } from "./colorSystem";
import { themeStore } from "../themeStore";

// 사용자 원래 디자인 스타일 기반 테마 정의 (컬러 버그 수정)
const getMenuTheme = (baseColor = 'blue') => {
  return {
    baseColor,
    // 1depth 닫힘(기본) 상태: 사용자 원래 스타일인 테마 컬러 텍스트 + 호버 연한 배경
    rootInactive: `text-${baseColor}-600 dark:text-${baseColor}-400 hover:bg-${baseColor}-50 hover:text-${baseColor}-700 dark:hover:bg-${baseColor}-950/40 font-medium`,
    // 1depth 열림(활성) 상태: 사용자 원래 스타일인 꽉 찬 테마 배경 + 흰색 텍스트
    rootActive: `bg-${baseColor}-500 hover:bg-${baseColor}-600 text-white font-medium shadow-sm`,

    // 서브메뉴 컨테이너 배경 (사용자 원래 스타일: bg-[#f1f4fa])
    subContainerBg: `bg-[#f1f4fa] dark:bg-gray-800/80`,

    // 서브메뉴 기본/호버 텍스트 (더 이상 흰색으로 사라지지 않고 선명한 가독성 보장)
    subItemDefault: `text-gray-700 dark:text-gray-200 hover:bg-${baseColor}-50/70 hover:text-${baseColor}-600`,
    // 서브메뉴 활성(선택) 상태
    subItemActive: `bg-${baseColor}-100 dark:bg-${baseColor}-950/70 text-${baseColor}-700 dark:text-${baseColor}-300 font-bold`,

    // 좌측 4px 포인트 바 색상
    barColor: `bg-${baseColor}-500`,
  };
};

export class SideMenu {
  constructor(containerOrId) {
    if (typeof containerOrId === 'string') {
      this.container = document.getElementById(containerOrId);
    } else {
      this.container = containerOrId;
    }

    if (!this.container) {
      throw new Error('SideMenu container not found.');
    }

    this.baseColor = themeStore.getActiveTheme().primaryColor || colorSystem.getCurrentBaseColor() || 'blue';
    this.theme = getMenuTheme(this.baseColor);

    // 하드웨어 가속 0fr -> 1fr CSS Grid 전환 스타일 보장
    if (!document.getElementById('sidemenu-grid-anim-style')) {
      const style = document.createElement('style');
      style.id = 'sidemenu-grid-anim-style';
      style.textContent = `
        .submenu-panel, .child-panel {
          display: grid !important;
          will-change: grid-template-rows, opacity;
        }
        .grid-rows-\\[0fr\\] { grid-template-rows: 0fr !important; }
        .grid-rows-\\[1fr\\] { grid-template-rows: 1fr !important; }
      `;
      document.head.appendChild(style);
    }
  }

  setBaseColor(baseColor) {
    this.baseColor = baseColor || 'blue';
    this.theme = getMenuTheme(this.baseColor);
    document.documentElement.style.setProperty("--menu-color-before", `var(--color-${this.baseColor}-500, #3b82f6)`);
  }

  renderMenu(menuData = [], maxDepth = 4) {
    this.container.innerHTML = "";
    this.maxDepth = Number(maxDepth) || 4;

    const nav = document.createElement("nav");
    nav.className = "w-full max-w-[320px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-2 font-sans select-none shadow-sm";

    const rootUl = document.createElement("ul");
    rootUl.className = "space-y-1";

    menuData.forEach((menu, index) => {
      // 첫 번째 메뉴(Dashboard)를 기본 활성화 상태로 열기
      const isDefaultOpen = index === 0;
      rootUl.appendChild(this.createRootMenuItem(menu, isDefaultOpen, this.maxDepth));
    });

    nav.appendChild(rootUl);
    this.container.appendChild(nav);
  }

  // 1depth 메뉴 항목 (사용자 원래 방식의 버튼 & 우측 화살표 구조)
  createRootMenuItem(menu, isDefaultOpen = false, maxDepth = 4) {
    const li = document.createElement("li");
    li.className = `root-menu-item w-full flex flex-col ${isDefaultOpen ? 'is-open' : ''}`;

    const hasChildren = maxDepth > 1 && Array.isArray(menu.children) && menu.children.length > 0;

    const headerBtn = document.createElement("div");
    headerBtn.className = [
      "root-btn w-full flex items-center justify-between px-4 py-3 text-sm rounded-md cursor-pointer transition-colors duration-200",
      isDefaultOpen ? this.theme.rootActive : this.theme.rootInactive,
    ].join(" ");

    // 텍스트 라벨
    const titleSpan = document.createElement("span");
    titleSpan.className = "font-medium tracking-tight text-left flex-1";
    titleSpan.textContent = menu.label || menu.name || "Menu";
    headerBtn.appendChild(titleSpan);

    if (hasChildren) {
      // 화살표 아이콘 (> 또는 v)
      const iconSpan = document.createElement("span");
      iconSpan.className = `arrow-icon ml-2 text-xs transition-transform duration-300 ${isDefaultOpen ? 'text-white rotate-90' : ''}`;
      iconSpan.innerHTML = '<i class="fas fa-angle-right"></i>';
      headerBtn.appendChild(iconSpan);

      li.appendChild(headerBtn);

      // 하위 서브메뉴 영역
      const panel = document.createElement("div");
      panel.className = [
        "submenu-panel grid transition-[grid-template-rows,opacity] duration-300 ease-in-out",
        isDefaultOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
      ].join(" ");

      const innerWrapper = document.createElement("div");
      innerWrapper.className = "overflow-hidden";

      // 서브메뉴 컨테이너
      const subContainer = document.createElement("div");
      subContainer.className = `${this.theme.subContainerBg} rounded-md p-1.5 my-1 space-y-0.5`;

      menu.children.forEach((child) => {
        subContainer.appendChild(this.createSubmenuItem(child, 2, maxDepth));
      });

      innerWrapper.appendChild(subContainer);
      panel.appendChild(innerWrapper);
      li.appendChild(panel);

      headerBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggleRootMenu(li);
      });
    } else {
      li.appendChild(headerBtn);

      // 하위가 없는 단독 1depth 메뉴인 경우 클릭 시 바로 선택 처리
      headerBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const parentUl = li.parentElement;
        if (parentUl) {
          parentUl.querySelectorAll(".root-menu-item").forEach((otherLi) => {
            if (otherLi !== li) this.closeRootPanel(otherLi);
          });
          parentUl.querySelectorAll(".root-btn").forEach((btn) => {
            this.theme.rootActive.split(" ").forEach(c => btn.classList.remove(c));
            this.theme.rootInactive.split(" ").forEach(c => btn.classList.add(c));
          });
        }
        this.theme.rootInactive.split(" ").forEach(c => headerBtn.classList.remove(c));
        this.theme.rootActive.split(" ").forEach(c => headerBtn.classList.add(c));
      });
    }

    return li;
  }

  // 1depth 상호 아코디언 토글
  toggleRootMenu(targetLi) {
    const parentUl = targetLi.parentElement;
    const isTargetOpen = targetLi.classList.contains("is-open");

    // 다른 열려있는 1depth 메뉴 닫기 (아코디언 동작)
    parentUl.querySelectorAll(".root-menu-item").forEach((otherLi) => {
      if (otherLi !== targetLi) {
        this.closeRootPanel(otherLi);
      }
    });

    if (isTargetOpen) {
      this.closeRootPanel(targetLi);
    } else {
      this.openRootPanel(targetLi);
    }
  }

  openRootPanel(li) {
    const headerBtn = li.querySelector(".root-btn");
    const panel = li.querySelector(".submenu-panel");
    const icon = li.querySelector(".arrow-icon");
    if (!panel) return;

    li.classList.add("is-open");

    // 1depth 버튼 활성화 스타일 전환
    this.theme.rootInactive.split(" ").forEach(c => headerBtn.classList.remove(c));
    this.theme.rootActive.split(" ").forEach(c => headerBtn.classList.add(c));

    if (icon) {
      icon.classList.add("text-white", "rotate-90");
    }

    // CSS Grid 1fr로 즉각 애니메이션 전환 (scrollHeight/Reflow 없이 60fps 보장)
    panel.classList.remove("grid-rows-[0fr]", "opacity-0");
    panel.classList.add("grid-rows-[1fr]", "opacity-100");
  }

  closeRootPanel(li) {
    const headerBtn = li.querySelector(".root-btn");
    const panel = li.querySelector(".submenu-panel");
    const icon = li.querySelector(".arrow-icon");
    if (!panel) return;

    li.classList.remove("is-open");

    // 1depth 버튼 비활성 스타일 복원
    this.theme.rootActive.split(" ").forEach(c => headerBtn.classList.remove(c));
    this.theme.rootInactive.split(" ").forEach(c => headerBtn.classList.add(c));

    if (icon) {
      icon.classList.remove("text-white", "rotate-90");
    }

    // CSS Grid 0fr로 매끄럽게 닫힘
    panel.classList.remove("grid-rows-[1fr]", "opacity-100");
    panel.classList.add("grid-rows-[0fr]", "opacity-0");
  }

  // 2, 3, 4 depth 서브메뉴 항목 (사용자 원래 좌측 4px 막대 바 & + 아이콘 방식)
  createSubmenuItem(item, depth = 2, maxDepth = 4) {
    const wrapper = document.createElement("div");
    wrapper.className = "w-full flex flex-col";

    const hasChildren = depth < maxDepth && Array.isArray(item.children) && item.children.length > 0;

    const row = document.createElement("div");
    row.className = [
      "sub-row group relative flex items-center justify-between py-2 pr-3 text-xs rounded cursor-pointer transition-colors duration-150 overflow-hidden",
      this.theme.subItemDefault,
    ].join(" ");

    // 뎁스별 들여쓰기 (1depth당 14px씩 계층적으로 들여쓰기)
    const indentLeft = (depth - 2) * 14 + 14;
    row.style.paddingLeft = `${indentLeft}px`;

    // 사용자 원래 디자인의 좌측 4px 컬러 바 (호버 및 활성 시 세로로 차오름)
    const leftBar = document.createElement("span");
    leftBar.className = `left-indicator absolute left-0 top-0 bottom-0 w-1 transition-all duration-200 ${this.theme.barColor} h-0 group-hover:h-full`;
    row.appendChild(leftBar);

    // 4depth 구분 불릿 포인트 (최하위 깊이 시각적 인디케이터)
    if (depth >= 4) {
      const dot = document.createElement("span");
      dot.className = "w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500 mr-1.5 flex-shrink-0 group-hover:scale-125 transition-transform";
      row.appendChild(dot);
    }

    // 텍스트 라벨 (배경과 뚜렷한 대비로 텍스트 가독성 확보)
    const titleSpan = document.createElement("span");
    titleSpan.className = `menu-text truncate flex-1 tracking-tight select-none ${depth >= 4 ? 'text-[11px] text-slate-600 dark:text-slate-300' : 'font-medium'}`;
    titleSpan.textContent = item.label || item.name || "Submenu";
    row.appendChild(titleSpan);

    if (hasChildren) {
      // 사용자 원래 스타일의 + 토글 아이콘
      const toggleIcon = document.createElement("span");
      toggleIcon.className = "text-[11px] text-gray-400 group-hover:text-gray-600 transition-transform duration-200 ml-2 flex-shrink-0";
      toggleIcon.innerHTML = '<i class="fas fa-plus"></i>';
      row.appendChild(toggleIcon);

      // 서브 패널도 동일한 CSS Grid 무지연 애니메이션 적용
      const childPanel = document.createElement("div");
      childPanel.className = "child-panel grid transition-[grid-template-rows,opacity] duration-200 ease-in-out grid-rows-[0fr] opacity-0";

      const childInner = document.createElement("div");
      childInner.className = "overflow-hidden";

      item.children.forEach((child) => {
        childInner.appendChild(this.createSubmenuItem(child, depth + 1, maxDepth));
      });

      childPanel.appendChild(childInner);
      wrapper.appendChild(row);
      wrapper.appendChild(childPanel);

      row.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = childPanel.classList.contains("grid-rows-[1fr]");
        if (isOpen) {
          childPanel.classList.remove("grid-rows-[1fr]", "opacity-100");
          childPanel.classList.add("grid-rows-[0fr]", "opacity-0");
          toggleIcon.innerHTML = '<i class="fas fa-plus"></i>';
        } else {
          childPanel.classList.remove("grid-rows-[0fr]", "opacity-0");
          childPanel.classList.add("grid-rows-[1fr]", "opacity-100");
          toggleIcon.innerHTML = '<i class="fas fa-minus"></i>';
        }
      });
    } else {
      wrapper.appendChild(row);
      row.addEventListener("click", (e) => {
        e.stopPropagation();
        this.selectLeafItem(row);
      });
    }

    return wrapper;
  }

  selectLeafItem(targetRow) {
    // 모든 서브메뉴 항목 선택 상태 초기화
    this.container.querySelectorAll(".sub-row").forEach((el) => {
      this.theme.subItemActive.split(" ").forEach(c => el.classList.remove(c));
      this.theme.subItemDefault.split(" ").forEach(c => el.classList.add(c));
      const bar = el.querySelector(".left-indicator");
      if (bar) bar.classList.remove("!h-full");
    });

    // 선택된 항목에 원래 스타일의 테마 하이라이트 + 4px 바 활성화 적용 (텍스트는 선명하게 유지)
    this.theme.subItemDefault.split(" ").forEach(c => targetRow.classList.remove(c));
    this.theme.subItemActive.split(" ").forEach(c => targetRow.classList.add(c));
    const activeBar = targetRow.querySelector(".left-indicator");
    if (activeBar) activeBar.classList.add("!h-full");
  }
}
