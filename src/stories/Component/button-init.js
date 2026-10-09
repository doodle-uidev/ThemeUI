import { createButton } from './Button.js';

const applyButtons = () => {
  document.querySelectorAll('.dynamic-button').forEach(button => {
    if (button.dataset.processed) return; // 중복 실행 방지
    button.dataset.processed = "true";

    // 🔍 데이터가 제대로 전달되는지 콘솔에 출력
    console.log("Original Button Data:", button.dataset);

    const newButton = createButton({
      label: button.dataset.label || 'Button',
      primary: button.dataset.primary === 'true',
      size: button.dataset.size || 'medium',
      backgroundColor: button.dataset.color || '',
      customClasses: button.dataset.custom || '',
      onClick: () => console.log(`${button.dataset.label} 버튼 클릭됨`),
    });

    // 🔍 새 버튼이 제대로 생성되었는지 확인
    console.log("New Button Generated:", newButton.outerHTML);

    button.replaceWith(newButton);
  });
};

document.addEventListener('DOMContentLoaded', applyButtons);
