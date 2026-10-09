// Button.js
import { twMerge } from '../../main/resources/static/js/common/util.js';

export const createButton = ({
  size = 'medium',
  customClasses = '',
  label = 'Button',
  onClick,
  id = '',
  icon = false,
  iconClass = '',
  iconPosition = 'left', // 'left' 또는 'right'
  disabled = false,
  loading = false,
  loadingText = '',
}) => {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.id = id;

  if (disabled || loading) {
    btn.disabled = true;
  }

  // onClick 이벤트 핸들러 추가
  if (typeof onClick === 'function' && !disabled && !loading) {
    btn.addEventListener('click', onClick);
  }

  // 기본 스타일: 트랜지션, 폰트, 포커스 등
  const baseStyles = (icon && !label)
    ? 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none'
    : 'inline-flex items-center justify-center px-4 py-2 font-semibold transition-all duration-200 focus:outline-none';

  // 사이즈 스타일
  const sizeStyles =
    size === 'large'
      ? 'text-lg px-5 py-2.5'
      : size === 'small'
      ? 'text-xs px-3 py-1.5'
      : 'text-sm px-4 py-2';

  // 비활성화 및 로딩 상태 스타일
  const stateStyles = disabled
    ? 'opacity-50 cursor-not-allowed pointer-events-none'
    : loading
    ? 'opacity-80 cursor-wait'
    : 'cursor-pointer';

  // 최종 클래스 설정
  btn.className = twMerge(baseStyles, sizeStyles, stateStyles, customClasses);

  // 로딩 상태 처리: 스피너 표시
  if (loading) {
    const spinner = document.createElement('span');
    spinner.className = 'inline-block w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0';
    btn.appendChild(spinner);

    const textToDisplay = loadingText || label;
    if (textToDisplay) {
      btn.appendChild(document.createTextNode(textToDisplay));
    }
    return btn;
  }

  // 아이콘이 있을 경우 배치 조절
  if (icon && iconClass) {
    const iconElement = document.createElement('i');
    if (iconPosition === 'left') {
      iconElement.className = label ? twMerge('mr-2', iconClass) : twMerge(iconClass);
      btn.appendChild(iconElement);
      if (label) {
        btn.appendChild(document.createTextNode(label));
      }
    } else if (iconPosition === 'right') {
      if (label) {
        btn.appendChild(document.createTextNode(label));
        iconElement.className = twMerge('ml-2', iconClass);
      } else {
        iconElement.className = twMerge(iconClass);
      }
      btn.appendChild(iconElement);
    }
  } else {
    // 아이콘 없이 단순 텍스트
    if (label) {
      btn.appendChild(document.createTextNode(label));
    }
  }

  return btn;
};
