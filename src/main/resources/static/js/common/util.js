export const CSSUtils = {
  setVariable: (element, variable, value) => element.style.setProperty(variable, value),
  getVariable: (element, variable) => getComputedStyle(element).getPropertyValue(variable).trim(),
};

export const DOMUtils = {
  clearInnerHTML: (element) => { element.innerHTML = ""; },
  toggleClass: (element, className) => element.classList.toggle(className),
  addClass: (element, className) => element.classList.add(className),
  removeClass: (element, className) => element.classList.remove(className),
};

export const fetchData = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    return null;
  }
};

// tailwindcss 클래스명을 병합하는 함수
export function twMerge(...classes) {
  return classes.filter(Boolean).join(' ');
}
