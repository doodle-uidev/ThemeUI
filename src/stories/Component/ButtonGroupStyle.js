// ButtonGroupStyle.js
export const buttonGroupStyleTemplates = {
  default: (baseColor = 'blue') => ({
    container: 'inline-flex shadow-xs',
    first: `border border-gray-200 bg-white text-${baseColor}-700 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-${baseColor}-700 focus:text-${baseColor}-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-${baseColor}-500 dark:focus:text-white`,
    middle: `border-t border-b border-gray-200 bg-white text-gray-900 hover:bg-gray-100 hover:text-${baseColor}-700 focus:z-10 focus:ring-2 focus:ring-${baseColor}-700 focus:text-${baseColor}-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-${baseColor}-500 dark:focus:text-white`,
    last: `border border-gray-200 bg-white text-gray-900 hover:bg-gray-100 hover:text-${baseColor}-700 focus:z-10 focus:ring-2 focus:ring-${baseColor}-700 focus:text-${baseColor}-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-${baseColor}-500 dark:focus:text-white`,
  }),
  outline: (baseColor = 'blue') => ({
    container: 'inline-flex shadow-xs',
    first: `border border-${baseColor}-700 bg-transparent text-${baseColor}-700 hover:bg-${baseColor}-50 focus:z-10 focus:ring-2 focus:ring-${baseColor}-700 dark:border-${baseColor}-500 dark:text-${baseColor}-400 dark:hover:bg-gray-800`,
    middle: `border-t border-b border-${baseColor}-700 bg-transparent text-${baseColor}-700 hover:bg-${baseColor}-50 focus:z-10 focus:ring-2 focus:ring-${baseColor}-700 dark:border-${baseColor}-500 dark:text-${baseColor}-400 dark:hover:bg-gray-800`,
    last: `border border-${baseColor}-700 bg-transparent text-${baseColor}-700 hover:bg-${baseColor}-50 focus:z-10 focus:ring-2 focus:ring-${baseColor}-700 dark:border-${baseColor}-500 dark:text-${baseColor}-400 dark:hover:bg-gray-800`,
  }),
};

export default buttonGroupStyleTemplates;
