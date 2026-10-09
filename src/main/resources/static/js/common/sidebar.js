import { CSSUtils } from "./util.js";

const cache = {};

function updateLayout() {
  const { sidebar, mainContent } = cache;
  if (!sidebar || !mainContent) return;

  const sidebarWidth = CSSUtils.getVariable(document.documentElement, "--sidebar-width") || "250px";
  const isCollapsed = sidebar.classList.contains("collapsed");

  mainContent.style.marginLeft = isCollapsed ? "0" : sidebarWidth;
}

function toggleSidebar() {
  const { sidebar, toggleSidebarButton } = cache;
  if (!sidebar || !toggleSidebarButton) return;

  const isCollapsed = sidebar.classList.toggle("collapsed");
  toggleSidebarButton.classList.toggle("collapsed");

  updateLayout();

  const icon = toggleSidebarButton.querySelector("i");
  if (icon) {
    icon.classList.toggle("fa-bars", !isCollapsed);
    icon.classList.toggle("fa-bars-staggered", isCollapsed);
    icon.classList.toggle("text-blue-700", isCollapsed);
  }
}

export function initializeSidebar() {
  cache.sidebar = document.getElementById("sidebar");
  cache.toggleSidebarButton = document.getElementById("toggleSidebar");
  cache.mainContent = document.getElementById("mainContent");

  updateLayout();

  if (cache.toggleSidebarButton) {
    cache.toggleSidebarButton.addEventListener("click", toggleSidebar);
  }
}
