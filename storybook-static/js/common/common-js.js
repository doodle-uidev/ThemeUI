// // DOM 요소 캐시
// const cache = {};

// // 유틸리티 함수
// const CSSUtils = {
//   setVariable: (element, variable, value) => element.style.setProperty(variable, value),
//   getVariable: (element, variable) => getComputedStyle(element).getPropertyValue(variable).trim(),
// };

// const DOMUtils = {
//   calculateTotalHeight: (elements) => Array.from(elements).reduce((total, el) => {
//     const styles = window.getComputedStyle(el);
//     return total + (el.offsetHeight + (parseInt(styles.marginTop) || 0) + (parseInt(styles.marginBottom) || 0));
//   }, 0),

//   clearInnerHTML: (element) => { element.innerHTML = ""; },
// };

// // 메뉴 데이터 로드
// function LeftloadMenu() {
//   axios.get('/menus/api/search')
//       .then(response => {
//           console.log('Data received:', response.data);
//           // 메뉴 데이터를 계층 구조로 변환
//           const hierarchicalMenu = buildMenuHierarchy(response.data);
//           // 변환된 데이터로 메뉴 렌더링
//           renderMenu(hierarchicalMenu);
//       })
//       .catch(error => {
//           console.error('Data loading failed:', error);
//       });
// }

// // 메뉴 계층 구조 생성
// function buildMenuHierarchy(menuData) {
//   console.log('Building menu hierarchy with:', menuData);

//   const menuMap = new Map();
//   const rootMenus = [];

//   // 모든 메뉴 항목을 Map에 저장
//   menuData.forEach(menu => {
//     menu.children = [];
//     menuMap.set(menu.id, menu);
//   });

//   // 계층 구조 구성
//   menuData.forEach(menu => {
//     // null 체크 추가
//     if (!menu.depth) {
//       console.warn('Menu depth is null:', menu);
//       return;
//     }

//     if (menu.depth === "1") {
//       // depth가 1인 경우 최상위 메뉴로 처리
//       rootMenus.push(menu);
//     } else {
//       // depth가 1이 아닌 경우 해당 부모의 하위 메뉴로 추가
//       const parentMenu = menuMap.get(menu.parentId);
//       if (parentMenu) {
//         parentMenu.children.push(menu);
//       }
//     }
//   });

//   console.log('Constructed hierarchy:', rootMenus); // 디버깅용
//   return rootMenus;
// }

// // 메뉴 렌더링
// function renderMenu(menuData) {
//   const ul = document.createElement("ul");
//   menuData.forEach((menu, index) => ul.appendChild(createMenuItem(menu, index)));
//   DOMUtils.clearInnerHTML(cache.menuContainer);
//   cache.menuContainer.appendChild(ul);

//   // 첫 번째 메뉴 항목을 활성화
//   // const firstNavLink = document.querySelector(".nav-link");
//   // if (firstNavLink) {
//   //     firstNavLink.classList.add("active");
//   //     firstNavLink.querySelector("span").classList.add("rotate");
//   //     const firstMenu = document.getElementById("menu0");
//   //     if (firstMenu) {
//   //         firstMenu.classList.add("open");
//   //         firstMenu.style.maxHeight = `${DOMUtils.calculateTotalHeight(firstMenu.querySelectorAll("*"))}px`;
//   //     }
//   // }
// }

// // 메뉴 항목 생성
// function createMenuItem(menu, index) {
//   console.log('Creating menu item:', menu); // 디버깅용

//   const li = document.createElement("li");
//   li.className = "nav-item";

//   const navLink = document.createElement("div");
//   navLink.className = "nav-link";
//   navLink.innerHTML = `${menu.name} <span><i class='fas fa-angle-right'></i></span>`;

//   // URL이 있는 경우 (1depth에 링크 직접 걸림)
//   if (menu.url && (!menu.children || menu.children.length === 0)) {
//     navLink.dataset.url = menu.url;
//     navLink.classList.add("has-url");
//     navLink.addEventListener("click", (event) => {
//       event.stopPropagation();
      
//       // 활성화 클래스 적용
//       setActiveMenu(navLink, "nav-item");
      
//       window.location.href = menu.url;
//     });
//   }

//   const submenuUl = document.createElement("ul");
//   submenuUl.id = `menu${index}`;
//   submenuUl.className = "submenu";

//   // children이 있는 경우 하위 메뉴 생성
//   if (menu.children && menu.children.length > 0) {
//     menu.children.forEach((childMenu, childIndex) => {
//       const childLi = document.createElement("li");
//       childLi.className = "submenu-item";
//       childLi.textContent = childMenu.name;

//       // URL 데이터 저장
//       if (childMenu.url) {
//         childLi.dataset.url = childMenu.url;
//       }

//       // 3depth 메뉴 처리
//       if (childMenu.children && childMenu.children.length > 0) {
//         childLi.classList.add("has-children");
//         childLi.innerHTML = `${childMenu.name} <span class='toggle-icon'><i class='fas fa-plus'></i></span>`;
//         const childrenUl = createChildrenMenu(childMenu.children, index, childIndex);
//         childLi.appendChild(childrenUl);
//         childLi.addEventListener("click", (event) => handleSubmenuToggle(childLi, event));
//       } else {
//         childLi.addEventListener("click", (event) => selectMenu(childLi, event));
//       }

//       submenuUl.appendChild(childLi);
//     });
//   } else {
//     // submenu가 없는 경우 화살표 아이콘 숨기기
//     navLink.querySelector("span").style.display = "none";
//   }

//   if (menu.children && menu.children.length > 0) {
//     navLink.addEventListener("click", () => {
//       toggleMenu(`menu${index}`, navLink);
//       setActiveMenu(navLink, "nav-item");
//     });
//   }

//   li.append(navLink, submenuUl);
//   return li;
// }

// // 자식 메뉴 생성
// function createChildrenMenu(childrenData, parentIndex, childIndex) {
//   const ul = document.createElement("ul");
//   ul.className = "children-menu";
//   ul.id = `submenu${parentIndex}-${childIndex}`;

//   childrenData.forEach((child) => {
//     const li = document.createElement("li");
//     li.className = "children-item";
//     li.textContent = child.name;
    
//     // URL 데이터 저장
//     if (child.url) {
//       li.dataset.url = child.url;
//     }
    
//     li.addEventListener("click", (event) => selectMenu(li, event));
//     ul.appendChild(li);
//   });

//   return ul;
// }

// // 서브메뉴 토글 핸들러
// function handleSubmenuToggle(li, event) {
//   event.stopPropagation();
//   const childrenMenu = li.querySelector(".children-menu");
//   const toggleIcon = li.querySelector(".toggle-icon i");
  
//   if (childrenMenu) {
//     const isOpen = childrenMenu.classList.contains("open");
//     if (!isOpen) {
//       childrenMenu.classList.add("open");
//       const totalHeight = DOMUtils.calculateTotalHeight(childrenMenu.querySelectorAll("*"));
//       childrenMenu.style.maxHeight = `${totalHeight + 20}px`; // 여유 공간 추가
//       toggleIcon.classList.replace("fa-plus", "fa-minus");
//     } else {
//       closeChildrenMenu(childrenMenu);
//     }
//   }
// }

// // 메뉴 토글
// function toggleMenu(menuId, link) {
//   const submenu = document.getElementById(menuId);
//   if (!submenu) return;

//   const isOpen = submenu.classList.contains("open");

//   // 다른 모든 메뉴 닫기
//   document.querySelectorAll(".submenu").forEach((menu) => {
//     menu.classList.remove("open");
//     menu.style.maxHeight = null;
//   });

//   document.querySelectorAll(".children-menu").forEach((menu) => closeChildrenMenu(menu));
//   document.querySelectorAll(".nav-link").forEach((menuLink) => menuLink.classList.remove("active"));
//   document.querySelectorAll(".nav-link span").forEach((icon) => icon.classList.remove("rotate"));

//   // 선택된 메뉴 토글
//   if (!isOpen) {
//     submenu.classList.add("open");
//     const totalHeight = DOMUtils.calculateTotalHeight(submenu.querySelectorAll("*"));
//     submenu.style.maxHeight = `${totalHeight + 20}px`; // 여유 공간 추가
//     link.querySelector("span").classList.add("rotate");
//     link.classList.add("active");
//   }
// }

// // 자식 메뉴 닫기
// function closeChildrenMenu(menu) {
//     menu.classList.remove("open");
//     menu.style.maxHeight = null;
//     const icon = menu.parentElement.querySelector(".toggle-icon i");
//     if (icon) icon.classList.replace("fa-minus", "fa-plus");
// }

// // 메뉴 선택
// function selectMenu(item, event) {
//     event.stopPropagation();
//     document.querySelectorAll(".submenu-item, .children-item").forEach((menuItem) => menuItem.classList.remove("selected"));
//     item.classList.add("selected");

//     if (!item.classList.contains("has-children") && !item.classList.contains("children-item")) {
//         document.querySelectorAll(".children-menu").forEach(closeChildrenMenu);
//     }

//     const parentMenu = item.closest(".submenu-item.has-children");
//     if (parentMenu) parentMenu.classList.add("selected");

//     // URL이 있는 경우 페이지 이동
//     if (item.dataset.url) {
//         window.location.href = item.dataset.url;
//     }
// }

// // 활성화된 메뉴 설정
// function setActiveMenu(link, className) {
//     document.querySelectorAll(`.${className}`).forEach((menuItem) => menuItem.classList.remove("active"));
//     link.closest(`.${className}`).classList.add("active");
// }

// function setActiveMenuOnLoad() {
//   const currentPath = window.location.pathname;
//   console.log("현재 URL:", currentPath);

//   let activeMenuItem = null;

//   document.querySelectorAll(".nav-link").forEach((navLink) => {
//     if (navLink.dataset.url === currentPath) {
//       navLink.classList.add("active");
//       activeMenuItem = navLink;
//     }
//   });

//   document.querySelectorAll(".submenu-item, .children-item").forEach((menuItem) => {
//     if (menuItem.dataset.url === currentPath) {
//       menuItem.classList.add("selected");
//       activeMenuItem = menuItem;
//     }
//   });

//   if (activeMenuItem) {
//     console.log("활성화된 메뉴:", activeMenuItem.textContent);
    
//     let parent = activeMenuItem.closest(".submenu, .children-menu");
//     while (parent && !parent.classList.contains("root-menu")) { 
//       parent.classList.add("open");
      
//       let totalHeight = 0;
//       parent.querySelectorAll(":scope > li").forEach((child) => {
//         totalHeight += child.offsetHeight;
//       });
//       parent.style.maxHeight = `${Math.min(totalHeight, 500)}px`; // max 500px
      
//       let nextParent = parent.closest(".submenu, .children-menu");
//       if (nextParent === parent) break; // 무한 루프 방지
//       parent = nextParent;
//     }

//     const navLink = activeMenuItem.closest(".nav-item")?.querySelector(".nav-link");
//     if (navLink) {
//       navLink.classList.add("active");
//       navLink.querySelector("span")?.classList.add("rotate");
//     }
//   }
// }


// document.querySelectorAll(".submenu-item").forEach((menuItem) => {
//   menuItem.addEventListener("click", function (event) {
//       const url = menuItem.dataset.url;
//       if (url) {
//           console.log("페이지 이동:", url);
//           setTimeout(() => {
//               window.location.href = url;
//           }, 100); // 100ms 지연 후 실행
//       }
//   });
// });




// // 초기화
// function initializeMenu() {
//   // DOM 요소 참조 설정 (가장 먼저 toggleSidebarButton을 설정)
//   cache.toggleSidebarButton = document.getElementById("toggleSidebar");
//   cache.sidebar = document.getElementById("sidebar");
//   cache.mainContent = document.getElementById("mainContent");
//   cache.menuContainer = document.getElementById("dynamicMenu");

//   // menuContainer가 없으면 초기화 중단
//   if (!cache.menuContainer) return;

//   // 사이드바 상태 초기화
//   initializeSidebarState();
//   LeftloadMenu(); // 서버에서 메뉴 데이터 로드

//    // 메뉴 데이터가 비동기 로드되므로 약간의 딜레이 후 실행
//    setTimeout(setActiveMenuOnLoad, 500);
//   // 메뉴 토글 버튼 처리
//   if (cache.toggleSidebarButton) {
//     cache.toggleSidebarButton.addEventListener("click", toggleSidebar);
//   }
// }

// // 사이드바 초기화
// function initializeSidebarState() {
//   const sidebarCollapsed = cache.sidebar?.classList.contains("collapsed"); // 사이드바가 축소되어 있는지 확인
//   const sidebarWidth = CSSUtils.getVariable(document.documentElement, "--sidebar-width"); // 사이드바 너비 값 가져옴

//   // 초기 상태에서는 transition을 없애서 레이아웃 변화가 즉시 반영되도록 설정
//   cache.mainContent.style.transition = "none";
//   cache.mainContent.style.marginLeft = sidebarCollapsed ? "0" : sidebarWidth;

//   // 다음 렌더링 프레임에서 transition을 다시 활성화
//   requestAnimationFrame(() => {
//     cache.mainContent.style.marginLeft = `${cache.sidebar.offsetWidth}px`;
//     cache.mainContent.style.transition = "";
//   });
// }

// // 사이드바 토글
// function toggleSidebar() {
//   const { sidebar, toggleSidebarButton, mainContent } = cache;

//   if (!sidebar || !toggleSidebarButton || !mainContent) return; // DOM 요소가 없는 경우 함수 종료

//   // 'collapsed' 클래스를 토글하여 사이드바 열고 닫기
//   const isCollapsed = sidebar.classList.toggle("collapsed");

//   // 토글 버튼에 'collapsed' 클래스 적용
//   toggleSidebarButton.classList.toggle("collapsed");

//   // 사이드바 너비를 가져와서 mainContent의 marginLeft 조정
//   const sidebarWidth = CSSUtils.getVariable(document.documentElement, "--sidebar-width");
//   mainContent.style.marginLeft = isCollapsed ? "0" : sidebarWidth;

//   // 토글 버튼 아이콘 변경
//   const icon = toggleSidebarButton.querySelector("i");
//   if (icon) {
//     icon.classList.toggle("fa-bars", !isCollapsed);
//     icon.classList.toggle("fa-bars-staggered", isCollapsed);
//     icon.classList.toggle("text-blue-700", icon.classList.contains("fa-bars-staggered"));
//   }

//   // 툴팁 텍스트 변경
//   const tooltip = document.querySelector("#tooltip-menu-fold");
//   if (tooltip) {
//     tooltip.textContent = isCollapsed ? "메뉴 펼치기" : "메뉴 접기";
//   }
// }


// document.addEventListener("DOMContentLoaded", initializeMenu);
