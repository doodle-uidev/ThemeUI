// Light 모드 설정
const light = (baseColor) => ({
  bg: `bg-${baseColor}-500`,
  text: `text-${baseColor}-500`,
  border: `border-${baseColor}-500`,
  hoverBg: `hover:bg-${baseColor}-600`,
  hoverText: `hover:text-${baseColor}-600`,
  hoverBorder: `hover:border-${baseColor}-600`,
  focusRing: `focus:ring-${baseColor}-300`,
});

// Dark 모드 설정
const dark = (baseColor) => ({
  text: `dark:text-${baseColor}-400`,
  hoverText: `dark:hover:text-${baseColor}-100`,
  hoverBg: `dark:hover:bg-${baseColor}-900`,
  border: `dark:border-transparent`,
  hoverBorder: `dark:hover:border-${baseColor}-600`,
  focusRing: `dark:focus:ring-${baseColor}-800`,
});

export const buttonStyleTemplates = {
  flat: (baseColor = 'indigo') => ({
    base: `${light(baseColor).bg} text-white border-1 ${light(baseColor).border}`,
    hover: `${light(baseColor).hoverBg} ${light(baseColor).hoverBorder}`,
    focus: `focus:outline-none focus:ring-4 ${light(baseColor).focusRing} ${dark(baseColor).focusRing} ${light(baseColor).border}`,
  }),
  outline: (baseColor = 'indigo') => ({
    base: `border-1 ${light(baseColor).border} ${light(baseColor).text}`,
    hover: `${light(baseColor).hoverBg} hover:text-white ${light(baseColor).hoverBorder}`,
    focus: `focus:outline-none focus:ring-4 ${light(baseColor).focusRing} ${dark(baseColor).focusRing} ${light(baseColor).border}`,
  }),
  pills: (baseColor = 'indigo') => ({
    base: `rounded-full ${light(baseColor).bg} text-white border-1 ${light(baseColor).border}`,
    hover: `${light(baseColor).hoverBg} ${light(baseColor).hoverBorder}`,
    focus: `focus:outline-none focus:ring-4 ${light(baseColor).focusRing} ${dark(baseColor).focusRing} ${light(baseColor).border}`,
  }),
  gradient: (baseColor = 'indigo', toColor = 'purple') => ({
    base: `bg-gradient-to-r from-${baseColor}-500 to-${toColor}-600 text-white border-1 ${light(baseColor).border}`,
    hover: `hover:from-${baseColor}-600 hover:to-${toColor}-700 hover:border-${toColor}-700`,
    focus: `focus:outline-none focus:ring-4 focus:ring-${toColor}-300 ${dark(baseColor).focusRing} ${light(baseColor).border}`,
  }),
  iconOnly: (baseColor = 'blue') => ({
    base: `px-2 py-1 rounded-md border-1 ${light(baseColor).border} ${light(baseColor).hoverBg} ${light(baseColor).hoverBorder} ${dark(baseColor).text} ${dark(baseColor).hoverText} ${dark(baseColor).hoverBg} ${dark(baseColor).border} ${dark(baseColor).hoverBorder}`,
    focus: `focus:outline-none focus:ring-4 ${light(baseColor).focusRing} ${dark(baseColor).focusRing} ${light(baseColor).border}`,
    icon: ``,
  }),
  textOnly: (baseColor = 'blue') => ({
    base: `${light(baseColor).text} font-medium border-1 border-transparent`,
    hover: `${light(baseColor).hoverText} ${light(baseColor).hoverBorder}`,
    focus: `focus:outline-none focus:ring-2 ${light(baseColor).focusRing} ${dark(baseColor).focusRing} ${light(baseColor).border}`,
  }),
  lightDefault: (baseColor = "blue") => ({
    base: `bg-white text-gray-800 border border-gray-300 px-3 py-2`,
    hover: `${light(baseColor).hoverText} hover:bg-gray-100 hover:border-gray-200`,
    focus: `focus:outline-none focus:ring-3 focus:ring-gray-200 ${dark(baseColor).focusRing}`,
  }),
};
