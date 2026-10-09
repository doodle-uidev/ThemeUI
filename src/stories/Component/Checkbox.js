// src/stories/Component/Checkbox.js
import { themeStore } from '../themeStore';

// SVG 아이콘 프리셋 (인라인 크기 강제 적용으로 스타일 충돌 방지)
const ICON_PRESETS = {
  check: `
    <svg style="width: 100% !important; height: 100% !important; display: block;" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
    </svg>
  `,
  star: `
    <svg style="width: 100% !important; height: 100% !important; display: block;" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
    </svg>
  `,
  heart: `
    <svg style="width: 100% !important; height: 100% !important; display: block;" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  `,
  bookmark: `
    <svg style="width: 100% !important; height: 100% !important; display: block;" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
    </svg>
  `,
};

export const createCheckbox = ({
  size = 'medium',
  baseColor,
  rounded,
  label = '체크박스 옵션',
  description = '',
  onClick,
  onChange,
  customClasses = '',
  id = '',
  checked = false,
  disabled = false,

  // 🌟 커스텀 렌더링 옵션
  customType = 'default', // 'default' | 'svg' | 'image' | 'card'
  customIcon = 'check',   // 'check' | 'star' | 'heart' | 'bookmark' 또는 커스텀 SVG 문자열
  imageUrl = '',          // customType === 'image' 또는 'card'에서 사용할 이미지 URL
} = {}) => {
  // 전역 테마 토큰 자동 상속
  const activeTheme = themeStore.getActiveTheme();
  const effectiveColor = baseColor || activeTheme.primaryColor || 'blue';
  const effectiveRadius = rounded || activeTheme.borderRadius || 'md';

  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  // 인디케이터 모서리 곡률
  const indicatorRadius = effectiveRadius === 'full' ? 'rounded-full' : `rounded-${effectiveRadius}`;

  // 카드 컨테이너 곡률 (카드가 찌그러지지 않고 단정하고 모던한 카드형 곡률 유지)
  const cardRadiusClass = effectiveRadius === 'none' ? 'rounded-none' : effectiveRadius === 'sm' ? 'rounded-lg' : 'rounded-2xl';

  // 크기별 명시적 픽셀 치수 정의 (Tailwind 클래스 드롭 방지)
  const sizeMap = {
    small: { boxPx: 18, iconPx: 12, imgPx: 40, text: 'text-xs', padding: 'px-4 py-3' },
    medium: { boxPx: 22, iconPx: 14, imgPx: 48, text: 'text-sm', padding: 'px-5 py-4' },
    large: { boxPx: 26, iconPx: 16, imgPx: 56, text: 'text-base', padding: 'px-6 py-5' },
  };
  const currentSize = sizeMap[size] || sizeMap.medium;

  // ----------------------------------------------------
  // 1. [기본 모드] 브라우저 표준 form-checkbox
  // ----------------------------------------------------
  if (customType === 'default') {
    const container = document.createElement('div');
    container.className = `flex items-center gap-3 select-none py-1.5 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${customClasses}`;
    container.style.cssText = 'display: flex !important; align-items: center !important; gap: 12px !important;';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = checkboxId;
    checkbox.checked = checked;
    checkbox.disabled = disabled;
    checkbox.className = `form-checkbox text-${effectiveColor}-600 focus:ring-${effectiveColor}-500 focus:ring-2 ${indicatorRadius} transition-colors shrink-0 ${
      disabled ? 'cursor-not-allowed' : 'cursor-pointer'
    }`;
    checkbox.style.cssText = `width: ${currentSize.boxPx}px !important; height: ${currentSize.boxPx}px !important; flex-shrink: 0 !important;`;

    const labelElement = document.createElement('label');
    labelElement.setAttribute('for', checkboxId);
    labelElement.className = `${currentSize.text} font-medium text-gray-900 dark:text-gray-200 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`;
    labelElement.style.cssText = 'cursor: pointer; margin: 0; line-height: 1.4;';
    labelElement.textContent = label;

    if (onClick) checkbox.addEventListener('click', onClick);
    if (onChange) checkbox.addEventListener('change', onChange);

    container.appendChild(checkbox);
    container.appendChild(labelElement);
    return container;
  }

  // ----------------------------------------------------
  // 2. [커스텀 렌더링 모드] SVG 아이콘 / 이미지 / 카드형
  // ----------------------------------------------------
  const container = document.createElement('div');
  container.className = `custom-checkbox-wrapper relative w-full block select-none ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${customClasses}`;
  container.style.cssText = 'position: relative !important; display: block !important; width: 100% !important; box-sizing: border-box !important;';

  // 스크린리더 및 폼 접근성용 네이티브 체크박스 (100% 완벽히 보이지 않게 격리)
  const hiddenInput = document.createElement('input');
  hiddenInput.type = 'checkbox';
  hiddenInput.id = checkboxId;
  hiddenInput.checked = checked;
  hiddenInput.disabled = disabled;
  hiddenInput.className = 'sr-only';
  hiddenInput.style.cssText = 'position: absolute !important; opacity: 0 !important; width: 0 !important; height: 0 !important; pointer-events: none !important; margin: 0 !important; padding: 0 !important; border: 0 !important; clip: rect(0, 0, 0, 0) !important; -webkit-appearance: none !important; appearance: none !important;';

  const labelEl = document.createElement('label');
  labelEl.setAttribute('for', checkboxId);

  // SVG 마크업 파싱
  const svgMarkup = ICON_PRESETS[customIcon] || customIcon || ICON_PRESETS.check;

  // 🌟 (A) SVG 아이콘 커스텀 모드: 완벽한 flex-row 분리 및 넉넉한 14px 마진 확보
  if (customType === 'svg') {
    labelEl.className = `group flex items-start w-full py-2.5 px-3 rounded-xl hover:bg-gray-100/70 dark:hover:bg-gray-800/60 transition-colors ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`;
    labelEl.style.cssText = 'display: flex !important; flex-direction: row !important; align-items: flex-start !important; width: 100% !important; box-sizing: border-box !important; cursor: pointer; text-decoration: none !important;';
    
    labelEl.innerHTML = `
      <div class="custom-indicator ${indicatorRadius} border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 transition-all duration-200 shadow-xs" style="display: flex !important; align-items: center !important; justify-content: center !important; width: ${currentSize.boxPx}px !important; height: ${currentSize.boxPx}px !important; min-width: ${currentSize.boxPx}px !important; min-height: ${currentSize.boxPx}px !important; max-width: ${currentSize.boxPx}px !important; max-height: ${currentSize.boxPx}px !important; flex: 0 0 ${currentSize.boxPx}px !important; margin-right: 14px !important; margin-top: 2px !important; box-sizing: border-box !important;">
        <span class="custom-icon-inner text-white transition-all duration-200 transform scale-0 opacity-0" style="display: flex !important; align-items: center !important; justify-content: center !important; width: ${currentSize.iconPx}px !important; height: ${currentSize.iconPx}px !important; min-width: ${currentSize.iconPx}px !important; min-height: ${currentSize.iconPx}px !important; line-height: 1 !important; transform: scale(0); opacity: 0;">
          ${svgMarkup}
        </span>
      </div>
      <div class="label-text-container" style="display: flex !important; flex-direction: column !important; justify-content: flex-start !important; align-items: flex-start !important; flex: 1 1 auto !important; min-width: 0 !important; text-align: left !important; box-sizing: border-box !important;">
        <span class="label-text font-semibold text-gray-900 dark:text-gray-100 ${currentSize.text} leading-snug transition-colors" style="display: block !important; margin: 0 !important; padding: 0 !important; line-height: 1.4 !important; text-align: left !important;">${label}</span>
        ${description ? `<span class="desc-text text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed" style="display: block !important; margin: 4px 0 0 0 !important; padding: 0 !important; font-size: 0.8125rem !important; line-height: 1.45 !important; text-align: left !important; color: #6b7280 !important;">${description}</span>` : ''}
      </div>
    `;
  }
  // 🌟 (B) 이미지 썸네일 커스텀 모드
  else if (customType === 'image') {
    const defaultImg = imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80';
    labelEl.className = `group flex items-center w-full p-3.5 rounded-2xl hover:bg-gray-100/70 dark:hover:bg-gray-800/60 transition-colors ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`;
    labelEl.style.cssText = 'display: flex !important; flex-direction: row !important; align-items: center !important; width: 100% !important; box-sizing: border-box !important; cursor: pointer;';
    
    labelEl.innerHTML = `
      <div class="image-wrapper relative group" style="position: relative !important; flex: 0 0 ${currentSize.imgPx}px !important; width: ${currentSize.imgPx}px !important; height: ${currentSize.imgPx}px !important; margin-right: 16px !important; box-sizing: border-box !important;">
        <div class="image-box relative overflow-hidden rounded-2xl border-2 border-gray-200 dark:border-gray-700 transition-all duration-200 shadow-xs" style="width: 100% !important; height: 100% !important; border-radius: 14px !important; overflow: hidden !important;">
          <img src="${defaultImg}" alt="${label}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" style="width: 100% !important; height: 100% !important; object-fit: cover !important; display: block !important;" />
          <div class="image-overlay absolute inset-0 bg-${effectiveColor}-900/15 opacity-0 transition-opacity" style="position: absolute; inset: 0; pointer-events: none;"></div>
        </div>
        <!-- 우측 상단 체크 뱃지 -->
        <div class="badge-check absolute -top-1.5 -right-1.5 rounded-full bg-${effectiveColor}-600 text-white flex items-center justify-center shadow-md transform scale-0 opacity-0 transition-all duration-200" style="position: absolute !important; top: -6px !important; right: -6px !important; width: 20px !important; height: 20px !important; border-radius: 9999px !important; display: flex !important; align-items: center !important; justify-content: center !important; transform: scale(0); opacity: 0;">
          <span style="width: 12px; height: 12px; display: flex; align-items: center; justify-content: center;">${ICON_PRESETS.check}</span>
        </div>
      </div>
      <div class="label-text-container" style="display: flex !important; flex-direction: column !important; justify-content: center !important; align-items: flex-start !important; flex: 1 1 auto !important; min-width: 0 !important; text-align: left !important; box-sizing: border-box !important;">
        <span class="label-text font-bold text-gray-900 dark:text-gray-100 ${currentSize.text} leading-snug transition-colors" style="display: block !important; margin: 0 !important; padding: 0 !important; line-height: 1.4 !important; text-align: left !important;">${label}</span>
        ${description ? `<span class="desc-text text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed" style="display: block !important; margin: 4px 0 0 0 !important; padding: 0 !important; font-size: 0.8125rem !important; line-height: 1.45 !important; text-align: left !important; color: #6b7280 !important;">${description}</span>` : ''}
      </div>
    `;
  }
  // 🌟 (C) 카드형(Card) 선택기 모드: 컨테이너와 컨텐츠 간격이 시원한 정돈된 모던 카드
  else if (customType === 'card') {
    const defaultImg = imageUrl || '';
    labelEl.className = `group flex items-center justify-between w-full min-h-[72px] ${currentSize.padding} ${cardRadiusClass} border-2 border-gray-200/90 dark:border-gray-700/80 bg-white dark:bg-gray-800/90 transition-all duration-200 shadow-xs hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`;
    labelEl.style.cssText = 'display: flex !important; flex-direction: row !important; align-items: center !important; justify-content: space-between !important; width: 100% !important; min-height: 72px !important; box-sizing: border-box !important; cursor: pointer;';
    
    labelEl.innerHTML = `
      <div class="card-content-left" style="display: flex !important; flex-direction: row !important; align-items: center !important; flex: 1 1 auto !important; min-width: 0 !important; margin-right: 16px !important; box-sizing: border-box !important;">
        ${imageUrl ? `
          <div class="card-thumb shrink-0 overflow-hidden rounded-xl border border-gray-200/80 dark:border-gray-700 shadow-xs" style="flex: 0 0 ${currentSize.imgPx}px !important; width: ${currentSize.imgPx}px !important; height: ${currentSize.imgPx}px !important; margin-right: 14px !important; border-radius: 12px !important; overflow: hidden !important;">
            <img src="${defaultImg}" class="w-full h-full object-cover" alt="${label}" style="width: 100% !important; height: 100% !important; object-fit: cover !important; display: block !important;" />
          </div>
        ` : ''}
        <div class="label-text-container" style="display: flex !important; flex-direction: column !important; justify-content: center !important; align-items: flex-start !important; flex: 1 1 auto !important; min-width: 0 !important; text-align: left !important; box-sizing: border-box !important;">
          <span class="label-text font-bold text-gray-900 dark:text-gray-100 ${currentSize.text} leading-snug transition-colors" style="display: block !important; margin: 0 !important; padding: 0 !important; line-height: 1.4 !important; text-align: left !important;">${label}</span>
          ${description ? `<span class="desc-text text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed" style="display: block !important; margin: 4px 0 0 0 !important; padding: 0 !important; font-size: 0.8125rem !important; line-height: 1.45 !important; text-align: left !important; color: #6b7280 !important;">${description}</span>` : ''}
        </div>
      </div>
      <!-- 우측 커스텀 SVG 체크 인디케이터 (절대 텍스트와 겹치지 않는 독립 인디케이터) -->
      <div class="custom-indicator rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 transition-all duration-200 shadow-2xs" style="display: flex !important; align-items: center !important; justify-content: center !important; width: 24px !important; height: 24px !important; min-width: 24px !important; min-height: 24px !important; flex: 0 0 24px !important; margin-left: auto !important; border-radius: 8px !important; box-sizing: border-box !important;">
        <span class="custom-icon-inner text-white transition-all duration-200 transform scale-0 opacity-0" style="display: flex !important; align-items: center !important; justify-content: center !important; width: 14px !important; height: 14px !important; line-height: 1 !important; transform: scale(0); opacity: 0;">
          ${svgMarkup}
        </span>
      </div>
    `;
  }

  // 상태 변경에 따른 비주얼 업데이트 함수 (인라인 transform/opacity 동기화로 100% 동작 보장)
  const updateVisualState = () => {
    const isChecked = hiddenInput.checked;

    if (customType === 'svg') {
      const indicator = labelEl.querySelector('.custom-indicator');
      const iconInner = labelEl.querySelector('.custom-icon-inner');
      const labelText = labelEl.querySelector('.label-text');

      if (indicator && iconInner) {
        if (isChecked) {
          indicator.classList.remove('border-gray-300', 'dark:border-gray-600', 'bg-white', 'dark:bg-gray-800');
          indicator.classList.add(`bg-${effectiveColor}-600`, `border-${effectiveColor}-600`, 'shadow-sm', 'ring-4', `ring-${effectiveColor}-500/15`);
          iconInner.classList.remove('scale-0', 'opacity-0');
          iconInner.classList.add('scale-100', 'opacity-100');
          iconInner.style.transform = 'scale(1)';
          iconInner.style.opacity = '1';
          if (labelText) labelText.classList.add(`text-${effectiveColor}-700`, 'dark:text-white');
        } else {
          indicator.classList.add('border-gray-300', 'dark:border-gray-600', 'bg-white', 'dark:bg-gray-800');
          indicator.classList.remove(`bg-${effectiveColor}-600`, `border-${effectiveColor}-600`, 'shadow-sm', 'ring-4', `ring-${effectiveColor}-500/15`);
          iconInner.classList.add('scale-0', 'opacity-0');
          iconInner.classList.remove('scale-100', 'opacity-100');
          iconInner.style.transform = 'scale(0)';
          iconInner.style.opacity = '0';
          if (labelText) labelText.classList.remove(`text-${effectiveColor}-700`, 'dark:text-white');
        }
      }
    } else if (customType === 'image') {
      const imageBox = labelEl.querySelector('.image-box');
      const badge = labelEl.querySelector('.badge-check');
      const overlay = labelEl.querySelector('.image-overlay');
      const labelText = labelEl.querySelector('.label-text');

      if (imageBox && badge && overlay) {
        if (isChecked) {
          imageBox.classList.remove('border-gray-200', 'dark:border-gray-700');
          imageBox.classList.add(`border-${effectiveColor}-500`, 'ring-4', `ring-${effectiveColor}-500/25`);
          badge.classList.remove('scale-0', 'opacity-0');
          badge.classList.add('scale-100', 'opacity-100');
          badge.style.transform = 'scale(1)';
          badge.style.opacity = '1';
          overlay.classList.remove('opacity-0');
          overlay.classList.add('opacity-100');
          if (labelText) labelText.classList.add(`text-${effectiveColor}-600`, 'dark:text-white');
        } else {
          imageBox.classList.add('border-gray-200', 'dark:border-gray-700');
          imageBox.classList.remove(`border-${effectiveColor}-500`, 'ring-4', `ring-${effectiveColor}-500/25`);
          badge.classList.add('scale-0', 'opacity-0');
          badge.classList.remove('scale-100', 'opacity-100');
          badge.style.transform = 'scale(0)';
          badge.style.opacity = '0';
          overlay.classList.add('opacity-0');
          overlay.classList.remove('opacity-100');
          if (labelText) labelText.classList.remove(`text-${effectiveColor}-600`, 'dark:text-white');
        }
      }
    } else if (customType === 'card') {
      const indicator = labelEl.querySelector('.custom-indicator');
      const iconInner = labelEl.querySelector('.custom-icon-inner');
      const labelText = labelEl.querySelector('.label-text');

      if (indicator && iconInner) {
        if (isChecked) {
          labelEl.classList.remove('border-gray-200/90', 'dark:border-gray-700/80', 'bg-white', 'dark:bg-gray-800/90');
          labelEl.classList.add(`border-${effectiveColor}-500`, `bg-${effectiveColor}-50/50`, 'dark:bg-gray-800', 'shadow-md', 'ring-1', `ring-${effectiveColor}-500/40`);
          indicator.classList.remove('border-gray-300', 'dark:border-gray-600', 'bg-gray-50', 'dark:bg-gray-700');
          indicator.classList.add(`bg-${effectiveColor}-600`, `border-${effectiveColor}-600`, 'shadow-xs');
          iconInner.classList.remove('scale-0', 'opacity-0');
          iconInner.classList.add('scale-100', 'opacity-100');
          iconInner.style.transform = 'scale(1)';
          iconInner.style.opacity = '1';
          if (labelText) labelText.classList.add(`text-${effectiveColor}-900`, 'dark:text-white');
        } else {
          labelEl.classList.add('border-gray-200/90', 'dark:border-gray-700/80', 'bg-white', 'dark:bg-gray-800/90');
          labelEl.classList.remove(`border-${effectiveColor}-500`, `bg-${effectiveColor}-50/50`, 'dark:bg-gray-800', 'shadow-md', 'ring-1', `ring-${effectiveColor}-500/40`);
          indicator.classList.add('border-gray-300', 'dark:border-gray-600', 'bg-gray-50', 'dark:bg-gray-700');
          indicator.classList.remove(`bg-${effectiveColor}-600`, `border-${effectiveColor}-600`, 'shadow-xs');
          iconInner.classList.add('scale-0', 'opacity-0');
          iconInner.classList.remove('scale-100', 'opacity-100');
          iconInner.style.transform = 'scale(0)';
          iconInner.style.opacity = '0';
          if (labelText) labelText.classList.remove(`text-${effectiveColor}-900`, 'dark:text-white');
        }
      }
    }
  };

  // 초기 상태 반영
  updateVisualState();

  // 이벤트 리스너 등록
  if (!disabled) {
    hiddenInput.addEventListener('change', (e) => {
      updateVisualState();
      if (typeof onChange === 'function') onChange(e);
      if (typeof onClick === 'function') onClick(e);
    });
  }

  container.appendChild(hiddenInput);
  container.appendChild(labelEl);
  return container;
};

export default createCheckbox;

