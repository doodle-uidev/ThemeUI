// Light 모드 설정
const light = (baseColor) => ({
  text: `text-gray-900`,
  bg: `bg-gray-50`,
  border: `border-gray-300`,
  focusRing: `focus:ring-${baseColor}-500 focus:border-${baseColor}-500`,
  button: `
    bg-${baseColor}-600 
    hover:bg-${baseColor}-700 
    focus:ring-4 focus:ring-${baseColor}-300
  `,
});

// Dark 모드 설정
const dark = (baseColor) => ({
  text: `dark:text-gray-300`,
  bg: `dark:bg-gray-700`,
  border: `dark:border-gray-600`,
  focusRing: `dark:focus:ring-${baseColor}-800 dark:focus:border-${baseColor}-800`,
  button: `
    dark:bg-${baseColor}-600 
    dark:hover:bg-${baseColor}-700 
    dark:focus:ring-${baseColor}-800
  `,
});

export const Forms = ({ baseColor = 'blue', rounded = 'md', size = 'md' }) => {
  const lightStyles = light(baseColor);
  const darkStyles = dark(baseColor);

  // Input과 Button의 크기별 클래스 설정
  const inputSizeClasses = {
    sm: 'py-1.5 px-2 text-sm', // 약 32px 높이
    md: 'py-2 px-3 text-base', // 약 38px 높이
    lg: 'py-3 px-4 text-lg',   // 약 48px 높이
  };

  const buttonSizeClasses = {
    sm: 'px-3 py-1.5 text-sm', // 약 32px 높이
    md: 'px-4 py-2 text-base', // 약 38px 높이
    lg: 'px-5 py-3 text-lg',   // 약 48px 높이
  };

  return `
    <form class="max-w-sm mx-auto">
      <div class="mb-5">
        <label for="large-input" class="block mb-2 text-sm font-medium ${lightStyles.text} ${darkStyles.text}">Large input</label>
        <input type="text" id="large-input" class="block w-full ${inputSizeClasses[size]} ${lightStyles.text} ${darkStyles.text} ${lightStyles.border} ${darkStyles.border} rounded-${rounded} ${lightStyles.bg} ${darkStyles.bg} ${lightStyles.focusRing} ${darkStyles.focusRing}">
      </div>
      <button type="submit" class="text-white font-medium rounded-${rounded} ${buttonSizeClasses[size]} text-center ${lightStyles.button} ${darkStyles.button}">Submit</button>
    </form>
  `;
};

export const LoginForm = ({ baseColor = 'blue', rounded = 'md', size = 'md' }) => {
  const lightStyles = light(baseColor);
  const darkStyles = dark(baseColor);

  const inputSizeClasses = {
    sm: 'h-8 text-sm px-2',
    md: 'h-10 text-base px-3',
    lg: 'h-12 text-lg px-4',
  };

  return `
    <form class="max-w-sm mx-auto">
      <div class="mb-5">
        <label for="email" class="block mb-2 text-sm font-medium ${lightStyles.text} ${darkStyles.text}">Email</label>
        <input type="email" id="email" class="block w-full ${inputSizeClasses[size]} ${lightStyles.text} ${darkStyles.text} ${lightStyles.border} ${darkStyles.border} rounded-${rounded} ${lightStyles.bg} ${darkStyles.bg} ${lightStyles.focusRing} ${darkStyles.focusRing}" required>
      </div>
      <div class="mb-5">
        <label for="password" class="block mb-2 text-sm font-medium ${lightStyles.text} ${darkStyles.text}">Password</label>
        <input type="password" id="password" class="block w-full ${inputSizeClasses[size]} ${lightStyles.text} ${darkStyles.text} ${lightStyles.border} ${darkStyles.border} rounded-${rounded} ${lightStyles.bg} ${darkStyles.bg} ${lightStyles.focusRing} ${darkStyles.focusRing}" required>
      </div>
      <button type="submit" class="text-white font-medium rounded-${rounded} ${inputSizeClasses[size]} text-center ${lightStyles.button} ${darkStyles.button}">Login</button>
    </form>
  `;
};

export const Textarea = ({ baseColor = 'blue', rounded = 'md', size = 'md' }) => {
  const lightStyles = light(baseColor);
  const darkStyles = dark(baseColor);

  const inputSizeClasses = {
    sm: 'h-8 text-sm px-2',
    md: 'h-10 text-base px-3',
    lg: 'h-12 text-lg px-4',
  };

  return `
    <form class="max-w-sm mx-auto">
      <label for="message" class="block mb-2 text-sm font-medium ${lightStyles.text} ${darkStyles.text}">Your message</label>
      <textarea id="message" rows="4" class="block ${inputSizeClasses[size]} w-full ${lightStyles.text} ${darkStyles.text} ${lightStyles.bg} ${darkStyles.bg} rounded-${rounded} ${lightStyles.border} ${darkStyles.border} ${lightStyles.focusRing} ${darkStyles.focusRing}" placeholder="Leave a comment..."></textarea>
    </form>
  `;
};

// SelectInput 컴포넌트
export const SelectInput = ({ baseColor = 'blue', rounded = 'md', size = 'md' }) => {
  const lightStyles = light(baseColor);
  const darkStyles = dark(baseColor);

  const sizeClasses = {
    sm: 'p-2 text-sm',
    md: 'p-4 text-base',
    lg: 'p-6 text-lg',
  };

  return `
    <form class="max-w-sm mx-auto">
      <label for="countries" class="block mb-2 text-sm font-medium ${lightStyles.text} ${darkStyles.text}">Select your country</label>
      <select id="countries" class="block w-full ${sizeClasses[size]} ${lightStyles.text} ${darkStyles.text} ${lightStyles.bg} ${darkStyles.bg} rounded-${rounded} ${lightStyles.border} ${darkStyles.border} ${lightStyles.focusRing} ${darkStyles.focusRing}">
        <option>United States</option>
        <option>Canada</option>
        <option>France</option>
        <option>Germany</option>
      </select>
    </form>
  `;
};

// FileUpload 컴포넌트
export const FileUpload = ({ baseColor = 'blue', rounded = 'md', size = 'md' }) => {
  const lightStyles = light(baseColor);
  const darkStyles = dark(baseColor);

  // 크기별 높이 설정
  const sizeClasses = {
    sm: 'h-8 text-sm', // 약 32px 높이
    md: 'h-10 text-base', // 약 38px 높이
    lg: 'h-12 text-lg', // 약 48px 높이
  };

  return `
    <form class="max-w-lg mx-auto">
      <label class="block mb-2 text-sm font-medium ${lightStyles.text} ${darkStyles.text}" for="user_avatar">Upload file</label>
      <input class="block w-full ${sizeClasses[size]} ${lightStyles.text} ${darkStyles.text} ${lightStyles.bg} ${darkStyles.bg} rounded-${rounded} ${lightStyles.border} ${darkStyles.border} ${lightStyles.focusRing} ${darkStyles.focusRing}" id="user_avatar" type="file">
      <div class="mt-1 text-sm ${lightStyles.text} ${darkStyles.text}">No file selected</div>
    </form>
  `;
};

// ToggleSwitch 컴포넌트
export const ToggleSwitch = ({ baseColor = 'blue', rounded = 'full', size = 'md' }) => {
  const focusRingClass = `peer-focus:ring-${baseColor}-300 dark:peer-focus:ring-${baseColor}-600`;
  const checkedBgClass = `peer-checked:bg-${baseColor}-600 dark:peer-checked:bg-${baseColor}-800`;

  // ToggleSwitch 크기별 클래스 설정
  const sizeClasses = {
    sm: 'w-8 h-4',  // 약 32px 높이
    md: 'w-11 h-6', // 약 38px 높이
    lg: 'w-14 h-7', // 약 48px 높이
  };

  const afterSizeClasses = {
    sm: 'after:w-3 after:h-3', // 약 75% 크기
    md: 'after:w-5 after:h-5', // 약 83% 크기
    lg: 'after:w-6 after:h-6', // 약 85% 크기
  };

  // :after의 border-radius 설정
  const afterRoundedClasses = {
    none: 'after:rounded-none',
    sm: 'after:rounded-sm',
    md: 'after:rounded-md',
    lg: 'after:rounded-lg',
    full: 'after:rounded-full',
  };

  const peerCheckedStyles = `
    peer-checked:after:translate-x-full 
    rtl:peer-checked:after:-translate-x-full 
    peer-checked:after:border-white
  `;
  const afterStyles = `
    after:content-[''] 
    after:absolute 
    after:top-[2px] 
    after:start-[2px] 
    after:bg-white 
    after:border-gray-300 
    after:border 
    ${afterRoundedClasses[rounded]} 
    ${afterSizeClasses[size]} 
    after:transition-all
  `;
  const baseStyles = `
    relative ${sizeClasses[size]} bg-gray-200 
    peer-focus:outline-none peer-focus:ring-4 
    ${focusRingClass} 
    rounded-${rounded} peer dark:bg-gray-700 
    dark:border-gray-600 
    ${peerCheckedStyles} 
    ${afterStyles} 
    ${checkedBgClass}
  `;
  const labelStyles = `ms-3 text-sm font-medium text-gray-900 dark:text-gray-300`;

  return `
    <label class="inline-flex items-center mb-5 cursor-pointer">
      <input type="checkbox" value="" class="sr-only peer">
      <div class="${baseStyles}"></div>
      <span class="${labelStyles}">Toggle me</span>
    </label>
  `;
};