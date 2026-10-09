import { DOMUtils, fetchData } from "./util.js";

const cache = {};

async function loadMenu() {
  const menuData = await fetchData("/menus/api/getMenuList");
  if (menuData) {
    const hierarchicalMenu = buildMenuHierarchy(menuData);
    renderMenu(hierarchicalMenu);
    setActiveMenu();
  }
}

function buildMenuHierarchy(menuData) {
  const menuMap = new Map();
  const rootMenus = [];

  menuData.forEach((menu) => {
    menu.children = [];
    menuMap.set(menu.id, menu);
  });

  menuData.forEach((menu) => {
    if (menu.depth === "1") {
      rootMenus.push(menu);
    } else {
      const parentMenu = menuMap.get(menu.parentId);
      if (parentMenu) parentMenu.children.push(menu);
    }
  });

  return rootMenus;
}
// 메뉴 렌더링
function renderMenu(menuData) {
  const ul = document.createElement("ul");
  menuData.forEach((menu, index) => ul.appendChild(createMenuItem(menu, index)));
  DOMUtils.clearInnerHTML(cache.menuContainer);
  cache.menuContainer.appendChild(ul);
}
// 메뉴 활성화 초기화화
function resetActiveState() {
  document.querySelectorAll(".nav-link, .submenu-item").forEach((item) => item.classList.remove("active"));
  document.querySelectorAll(".nav-link .icon i").forEach((icon) => (icon.style.transform = "rotate(0deg)"));
}

function setActiveMenu(currentUrl = window.location.pathname) {
  const menuItems = document.querySelectorAll(".nav-link, .submenu-item");
  let activeSubmenu = null;

  menuItems.forEach((item) => {
    const itemUrl = item.dataset.url;

    if (itemUrl && itemUrl === currentUrl) {
      DOMUtils.addClass(item, "active");

      // 상위 메뉴 열기
      let parent = item.closest(".submenu");
      while (parent) {
        DOMUtils.addClass(parent, "open");

        const parentNav = parent.previousElementSibling;
        if (parentNav && parentNav.classList.contains("nav-link")) {
          DOMUtils.addClass(parentNav, "active");
        }

        // 새로운 부모를 찾되, 기존 부모와 다를 때만 진행
        const newParent = parent.closest(".submenu");
        if (!newParent || newParent === parent) break; // 무한 루프 방지
        parent = newParent;
      }

      // 선택된 메뉴 기억하기
      localStorage.setItem("activeMenu", currentUrl);
    } else {
      DOMUtils.removeClass(item, "active");
    }

    // 열린 submenu 저장
    if (item.closest(".submenu") && item.classList.contains("active")) {
      activeSubmenu = item.closest(".submenu");
    }
  });

  // 이전에 열린 submenu를 다시 열기
  if (activeSubmenu) {
    activeSubmenu.classList.add("open");
    activeSubmenu.style.maxHeight = activeSubmenu.scrollHeight + "px"; 
  }
}

// 1. 메뉴 항목 생성
function createMenuItem(menu, index) {
  const li = document.createElement("li");
  li.className = "nav-item";

  const navLink = document.createElement("div");
  navLink.className = "nav-link";

  // const iconClass = menu.children.length > 0 ? "fa-angle-right" : "fa-minus";
  // navLink.innerHTML = `${menu.name} <span class="icon"><i class="fas ${iconClass}"></i></span>`;
  navLink.innerHTML = `${menu.name} <span class="icon"><i class="fas fa-angle-right"></i></span>`

  const submenuUl = document.createElement("ul");
  submenuUl.id = `menu${index}`;
  submenuUl.className = "submenu";

  if (menu.children.length > 0) {
    menu.children.forEach((child) => {
      const childLi = document.createElement("li");
      childLi.className = "submenu-item";
      childLi.textContent = child.name;

      if (child.url) {
        childLi.dataset.url = child.url;
        childLi.addEventListener("click", (event) => {
          event.stopPropagation();
          resetActiveState();
          setActiveMenu(child.url);
          window.location.href = child.url;
        });
      }
      submenuUl.appendChild(childLi);
    });

    navLink.addEventListener("click", (event) => {
      closeAllSubmenus(submenuUl);
      toggleSubmenu(event, submenuUl, navLink);
    });
  } else {
    navLink.dataset.url = menu.url;
    navLink.addEventListener("click", (event) => {
      event.stopPropagation();
      resetActiveState();
      setActiveMenu(menu.url);
      window.location.href = menu.url;
    });
    // 1detph 만 있을 때 아이콘 안보이는 설정
    // navLink.querySelector(".icon").style.display = "none";
  }

  li.append(navLink, submenuUl);
  return li;
}

// 2. 서브메뉴 토글 
function toggleSubmenu(event, submenuUl, navLink) {
  event.stopPropagation();
  const isOpen = submenuUl.classList.contains("open");

  if (!isOpen) {
    submenuUl.style.transition = "none"; 
    submenuUl.style.maxHeight = "0px"; 
    submenuUl.offsetHeight; 

    requestAnimationFrame(() => {
      submenuUl.style.transition = "max-height 0.3s ease-out"; 
      submenuUl.style.maxHeight = submenuUl.scrollHeight + "px"; 
    });
  } else {
    submenuUl.style.maxHeight = "0px"; 
  }

  submenuUl.classList.toggle("open");
  navLink.classList.toggle("active", !isOpen);
  navLink.querySelector(".icon i").style.transform = !isOpen ? "rotate(90deg)" : "rotate(0deg)";
}

// 3. 서브메뉴 모두 닫기
function closeAllSubmenus(excludeUl) {
  document.querySelectorAll(".submenu").forEach((submenu) => {
    if (submenu !== excludeUl) {
      submenu.classList.remove("open");
      const navLink = submenu.previousElementSibling;
      if (navLink) {
        navLink.classList.remove("active");
        const icon = navLink.querySelector(".icon i");
        if (icon) {
          icon.style.transform = "rotate(0deg)";
        }
      }

      // 서브 메뉴가 닫힐 때 maxHeight 초기화
      submenu.style.maxHeight = null;
    }
  });
}

// 4. 메뉴 초기화
export function initializeMenu() {
  cache.menuContainer = document.getElementById("dynamicMenu");
  if (!cache.menuContainer) return;
  loadMenu();
  restoreActiveMenu();
}

function restoreActiveMenu() {
  const savedUrl = localStorage.getItem("activeMenu");
  if (savedUrl) {
    setActiveMenu(savedUrl);

    //  모든 open된 서브메뉴에 대해 max-height 강제 설정
    document.querySelectorAll(".submenu.open").forEach((submenu) => {
      submenu.style.maxHeight = "0px"; 
      submenu.style.overflow = "hidden"; 
      submenu.classList.remove("open"); 
      
      // 다시 open 추가
      requestAnimationFrame(() => {
        submenu.classList.add("open"); 
        submenu.style.transition = "max-height 0.3s ease-out"; 
        submenu.style.maxHeight = submenu.scrollHeight + "px"; 
      });
    });
  }
}