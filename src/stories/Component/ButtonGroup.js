// ButtonGroup.js
import { createButton } from "./Button";
import { twMerge } from '../../main/resources/static/js/common/util.js';
import { buttonGroupStyleTemplates } from "./ButtonGroupStyle";

export const createButtonGroup = ({
  buttons = [],         // 버튼 배열 [{ label, onClick, icon, iconClass, iconPosition, ... }, ...]
  groupClasses = '',    // 추가 컨테이너 클래스
  color = 'blue',       // 기본 색상
  size = 'medium',      // 버튼 사이즈: 'small', 'medium', 'large'
  rounded = 'md',       // 사용자가 선택한 옵션: none / sm / md / lg / full
  fullWidth = false,    // 그룹을 전체 너비로 설정할지 여부
  variant = 'default',  // 'default' 또는 'outline'
}) => {
  // 템플릿에서 스타일 획득
  const templateFn = buttonGroupStyleTemplates[variant] || buttonGroupStyleTemplates.default;
  const styles = templateFn(color);
  const container = document.createElement('div');
  let baseContainer = styles.container;
  
  // rounded 옵션을 위한 매핑: Tailwind에서 사용 가능한 값만 반환
  const mapping = {
    none: '',
    sm: 'sm',
    md: 'md',
    lg: 'lg',
    full: 'full',
  };
  const r = mapping[rounded] || '';

  if (fullWidth) {
    baseContainer = twMerge(baseContainer, 'w-full');
  }

  // 전체 div에 rounded 추가 (버튼 그룹 전체에 영향을 미침)
  container.className = twMerge(baseContainer, groupClasses, r ? `rounded-${r}` : '', 'inline-flex', 'shadow-xs');

  // 버튼 배열 순회: 첫번째/중간/마지막 버튼에 대해 각각 스타일 적용
  buttons.forEach((btn, index) => {
    let edgeClass = '';
    let roundedClass = '';
    
    if (index === 0) {
      edgeClass = styles.first;
      // 첫 번째 버튼: 왼쪽 모서리는 선택한 rounded 옵션 적용, 오른쪽 모서리는 제거
      roundedClass = r ? `rounded-l-${r} rounded-tr-none rounded-br-none` : '';
    } else if (index === buttons.length - 1) {
      edgeClass = styles.last;
      // 마지막 버튼: 오른쪽 모서리는 선택한 rounded 옵션 적용, 왼쪽 모서리는 제거
      roundedClass = r ? `rounded-r-${r} rounded-tl-none rounded-bl-none` : '';
    } else {
      edgeClass = styles.middle;
      roundedClass = ''; // 중간 버튼은 rounded 옵션 없음
    }

    const finalCustomClasses = twMerge(
      btn.customClasses || '',
      edgeClass,
      roundedClass,
      fullWidth ? 'w-full' : ''
    );

    const button = createButton({
      label: btn.label,
      onClick: btn.onClick,
      id: btn.id || '',
      icon: btn.icon || false,
      iconClass: btn.iconClass || '',
      iconPosition: btn.iconPosition || 'left',
      size,
      customClasses: finalCustomClasses,
    });
    container.appendChild(button);
  });
  return container;
};

export default createButtonGroup;
