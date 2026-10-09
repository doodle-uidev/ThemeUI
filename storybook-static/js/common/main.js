import { initializeMenu } from "./menu.js";
import { initializeSidebar } from "./sidebar.js";

document.addEventListener("DOMContentLoaded", () => {
  initializeSidebar(); // 사이드바 초기와
  initializeMenu(); // 메뉴 초기와
});
