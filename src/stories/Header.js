import { createButton } from './Component/Button';  // 이미 정의된 createButton
import './header.css';

export const createHeader = ({ user, onLogout, onLogin, onCreateAccount }) => {
  const header = document.createElement('header');
  const wrapper = document.createElement('div');
  wrapper.className = 'gnb flex items-center justify-between h-full';

  // === LEFT BLOCK ===
  const leftBlock = document.createElement('div');
  leftBlock.className = 'flex items-center';

  // Logo
  const logoBlock = document.createElement('div');
  logoBlock.className = 'header-title-block';
  logoBlock.innerHTML = `
    <a href="#" aria-label="Go to homepage">
      <h1 class="text-blue-700 pr-title">WINHUB</h1>
    </a>
  `;
  leftBlock.appendChild(logoBlock);

  // Sidebar Toggle Button
  const toggleSidebarBtn = createToggleSidebarButton();
  leftBlock.appendChild(toggleSidebarBtn);

  // === RIGHT BLOCK ===
  const rightBlock = document.createElement('div');
  rightBlock.className = 'flex items-center gap-2';

  // Search Form
  const searchForm = createSearchForm();
  rightBlock.appendChild(searchForm);

  // User Info / Account Area
  const account = createAccountSection(user, onLogin, onCreateAccount, onLogout);
  rightBlock.appendChild(account);

  // Icon Button Group (Logout / Settings)
  const buttonGroup = createIconButtonGroup();
  rightBlock.appendChild(buttonGroup);

  // === Append all to wrapper ===
  wrapper.appendChild(leftBlock);
  wrapper.appendChild(rightBlock);
  header.appendChild(wrapper);

  return header;
};

// === Sub Component: Sidebar Toggle Button ===
const createToggleSidebarButton = () => {
  const button = document.createElement('button');
  button.id = 'toggleSidebar';
  button.className = 'p-2 text-gray-400 toggle-btn';
  button.setAttribute('data-tooltip-target', 'tooltip-menu-fold');
  button.setAttribute('data-tooltip-style', 'light');
  button.setAttribute('data-tooltip-placement', 'right');
  button.innerHTML = '<i class="fas fa-bars"></i>';

  const tooltip = document.createElement('div');
  tooltip.id = 'tooltip-menu-fold';
  tooltip.role = 'tooltip';
  tooltip.className = 'absolute invisible inline-block px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 z-1000 tooltip';
  tooltip.innerHTML = `메뉴 접기<div class="tooltip-arrow" data-popper-arrow></div>`;

  button.appendChild(tooltip);

  return button;
};

// === Sub Component: Search Form ===
const createSearchForm = () => {
  const form = document.createElement('form');
  form.className = 'max-w-md mx-auto';
  form.innerHTML = `
    <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
    <div class="relative gnb-search">
      <div class="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3">
        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
        </svg>
      </div>
      <input type="search" id="default-search" class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg ps-10 bg-gray-50 focus:ring-blue-500 focus:border-blue-700" placeholder="Search.." required />
    </div>
  `;
  return form;
};

// === Sub Component: Account Section ===
const createAccountSection = (user, onLogin, onCreateAccount, onLogout) => {
  const account = document.createElement('div');
  account.className = 'flex items-center gap-2';

  if (user) {
    // Logged In 상태
    const logoutButton = document.createElement('button');
    logoutButton.type = 'button';
    logoutButton.className = 'px-4 py-2 font-semibold focus:outline-none text-sm text-blue-500 font-medium border-1 border-transparent hover:text-blue-600 hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-800 border-blue-500  rounded-sm';
    logoutButton.innerHTML = '<i class="mr-2 fa-solid fa-arrow-right-to-bracket"></i>Log out';
    logoutButton.addEventListener('click', onLogout);
    account.appendChild(logoutButton);
  } else if (onLogin || onCreateAccount) {
    // Logged Out 상태
    const loginButton = document.createElement('button');
    loginButton.type = 'button';
    loginButton.className = 'px-4 py-2 font-semibold focus:outline-none text-sm rounded-full bg-blue-500 text-white border-1 border-blue-500 hover:bg-blue-600 hover:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 rounded-md';
    loginButton.innerHTML = '<i class="mr-2 fa-solid fa-arrow-right-to-bracket"></i>Log in';
    loginButton.addEventListener('click', onLogin);

    const signUpButton = document.createElement('button');
    signUpButton.type = 'button';
    signUpButton.className = 'px-4 py-2 font-semibold focus:outline-none text-sm bg-white text-gray-800 border border-gray-300 px-3 py-2 hover:text-blue-600 hover:bg-gray-100 hover:border-gray-200 focus:outline-none focus:ring-3 focus:ring-gray-200 dark:focus:ring-blue-800 rounded-md';
    signUpButton.innerHTML = '<i class="mr-2 fa-solid fa-user-plus"></i>Sign Up';
    signUpButton.addEventListener('click', onCreateAccount);

    account.appendChild(loginButton);
    account.appendChild(signUpButton);
  }

  return account;
};

// === Sub Component: Icon Button Group ===
const createIconButtonGroup = () => {
  const buttonGroup = document.createElement('div');
  buttonGroup.className = 'flex items-center gap-2 gnb-btn-group';

  const logoutBtn = createButton({
    icon: true,
    iconClass: 'fa-solid fa-arrow-right-from-bracket',
    customClasses: 'button-type-gnb',
  });

  const settingsBtn = createButton({
    icon: true,
    iconClass: 'fa-solid fa-gear',
    customClasses: 'button-type-gnb',
  });

  buttonGroup.appendChild(logoutBtn);
  buttonGroup.appendChild(settingsBtn);

  return buttonGroup;
};
