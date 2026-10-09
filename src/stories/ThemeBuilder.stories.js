// src/stories/ThemeBuilder.stories.js
import { themeStore, availableColors, availableCustomColors } from './themeStore';
import { createButton } from './Component/Button';
import { buttonStyleTemplates } from './Component/ButtonStyle';
import { createAccordion } from './Component/Accordion';
import { SideMenu } from './Component/SideMenu';

export default {
  title: 'Theme Builder/Global Studio',
  parameters: {
    layout: 'fullscreen',
    options: {
      showPanel: false, // 하단 컨트롤 패널 숨김 (풀스크린 스튜디오 모드)
    },
    docs: {
      description: {
        component:
          '디자인 시스템의 전역 테마(Primary Color, 보조 컬러, 둥글기 등)를 한곳에서 설정하고 모든 컴포넌트에 실시간 적용 및 테마 내보내기(Export)를 수행하는 빌드 페이지입니다.',
      },
    },
  },
};

export const Builder = () => {
  const container = document.createElement('div');
  container.className = 'w-full min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-8 pb-24 font-sans overflow-y-auto';

  // 추천 메인 컬러 팔레트
  const featuredColors = [
    'blue', 'indigo', 'violet', 'purple', 'fuchsia',
    'pink', 'rose', 'sky', 'cyan', 'teal',
    'emerald', 'green', 'amber', 'orange', 'slate',
  ];

  const radiusOptions = [
    { label: 'None', value: 'none' },
    { label: 'Small', value: 'sm' },
    { label: 'Medium', value: 'md' },
    { label: 'Large', value: 'lg' },
    { label: 'Full', value: 'full' },
  ];

  const renderContent = () => {
    const activeTheme = themeStore.getActiveTheme();
    const primary = activeTheme.primaryColor || 'blue';
    const secondary = activeTheme.secondaryColor || 'indigo';
    const radius = activeTheme.borderRadius || 'md';

    container.innerHTML = `
      <div class="max-w-6xl mx-auto space-y-8">
        <!-- 1. 헤더 섹션 -->
        <div class="border-b border-slate-200 dark:border-slate-800 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-${primary}-100 text-${primary}-800 dark:bg-${primary}-900/60 dark:text-${primary}-200">
                Live Theme Studio
              </span>
              <span class="text-xs text-slate-500">v1.0.0</span>
            </div>
            <h1 class="text-3xl font-extrabold tracking-tight">Theme Builder & Token Studio</h1>
            <p class="text-slate-600 dark:text-slate-400 mt-1 text-sm">
              원하는 브랜드 컬러와 디자인 옵션을 선택하면 모든 컴포넌트에 즉시 전역 적용되며, 테마 파일로 저장하거나 내보낼 수 있습니다.
            </p>
          </div>

          <!-- 테마 내보내기/저장 버튼 그룹 -->
          <div class="flex flex-wrap gap-2.5">
            <button id="btn-save-server" class="px-4 py-2 text-sm font-semibold rounded-${radius} bg-${primary}-600 hover:bg-${primary}-700 text-white shadow-sm transition-all flex items-center gap-2 cursor-pointer">
              <span>💾</span> 시스템에 색상 등록
            </button>
            <button id="btn-export-json" class="px-4 py-2 text-sm font-semibold rounded-${radius} bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all flex items-center gap-2 cursor-pointer">
              <span>📥</span> 테마 JSON 다운로드
            </button>
            <button id="btn-import-json" class="px-4 py-2 text-sm font-semibold rounded-${radius} bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all flex items-center gap-2 cursor-pointer">
              <span>📂</span> 테마 JSON 불러오기
            </button>
            <input type="file" id="input-import-json" accept=".json" class="hidden" style="display:none;" />
            <button id="btn-reset-theme" class="px-3 py-2 text-sm font-medium rounded-${radius} text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-all cursor-pointer">
              초기화
            </button>
          </div>
        </div>

        <!-- 2. 컨트롤 패널 (색상 및 옵션 선택기) -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Primary Color 설정 카드 -->
          <div class="bg-white dark:bg-slate-800/80 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div class="flex justify-between items-center">
              <label class="text-sm font-bold text-slate-800 dark:text-slate-200">
                Primary Brand Color (메인 컬러)
              </label>
              <span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-${primary}-50 text-${primary}-600 dark:bg-${primary}-950 dark:text-${primary}-300 border border-${primary}-200 dark:border-${primary}-800">
                ${primary}
              </span>
            </div>

            <!-- 색상 팔레트 칩 그리드 -->
            <div class="grid grid-cols-5 gap-2.5 pt-1">
              ${featuredColors
                .map((color) => {
                  const isSelected = color === primary;
                  return `
                    <button
                      type="button"
                      data-color="${color}"
                      class="color-chip group relative flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? `border-${color}-600 ring-2 ring-${color}-400/50 bg-${color}-50/50 dark:bg-${color}-950/40`
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }"
                    >
                      <span class="w-6 h-6 rounded-full bg-${color}-500 shadow-sm block transition-transform group-hover:scale-110"></span>
                      <span class="text-[10px] font-medium text-slate-600 dark:text-slate-400 mt-1 capitalize">${color}</span>
                    </button>
                  `;
                })
                .join('')}
            </div>

            <!-- 전체 색상 드롭다운 -->
            <div class="pt-2 border-t border-slate-100 dark:border-slate-700/60">
              <label class="text-xs text-slate-500 mb-1 block">전체 Tailwind & 커스텀 컬러 선택</label>
              <select id="select-primary" class="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                ${availableColors.map((c) => `<option value="${c}" ${c === primary ? 'selected' : ''}>${c}</option>`).join('')}
                ${availableCustomColors.length ? `<optgroup label="Custom Colors">${availableCustomColors.map((c) => `<option value="${c}" ${c === primary ? 'selected' : ''}>${c}</option>`).join('')}</optgroup>` : ''}
              </select>
            </div>
          </div>

          <!-- Secondary & Accent Color 설정 카드 -->
          <div class="bg-white dark:bg-slate-800/80 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div class="flex justify-between items-center">
              <label class="text-sm font-bold text-slate-800 dark:text-slate-200">
                Secondary Color (보조 / 그라데이션)
              </label>
              <span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-${secondary}-50 text-${secondary}-600 dark:bg-${secondary}-950 dark:text-${secondary}-300 border border-${secondary}-200 dark:border-${secondary}-800">
                ${secondary}
              </span>
            </div>

            <p class="text-xs text-slate-500">그라데이션 버튼, 포인트 뱃지 등에 함께 적용되는 보조 색상입니다.</p>

            <div class="grid grid-cols-5 gap-2.5 pt-1">
              ${['indigo', 'purple', 'pink', 'rose', 'sky', 'teal', 'amber', 'emerald', 'violet', 'cyan']
                .map((color) => {
                  const isSelected = color === secondary;
                  return `
                    <button
                      type="button"
                      data-secondary="${color}"
                      class="secondary-chip group relative flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? `border-${color}-600 ring-2 ring-${color}-400/50 bg-${color}-50/50 dark:bg-${color}-950/40`
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }"
                    >
                      <span class="w-6 h-6 rounded-full bg-${color}-500 shadow-sm block transition-transform group-hover:scale-110"></span>
                      <span class="text-[10px] font-medium text-slate-600 dark:text-slate-400 mt-1 capitalize">${color}</span>
                    </button>
                  `;
                })
                .join('')}
            </div>
          </div>

          <!-- 스타일 옵션 (Border Radius & Theme Details) -->
          <div class="bg-white dark:bg-slate-800/80 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div class="flex justify-between items-center">
              <label class="text-sm font-bold text-slate-800 dark:text-slate-200">
                Border Radius (곡률)
              </label>
              <span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                ${radius}
              </span>
            </div>

            <div class="grid grid-cols-5 gap-2 pt-1">
              ${radiusOptions
                .map((r) => {
                  const isSelected = r.value === radius;
                  return `
                    <button
                      type="button"
                      data-radius="${r.value}"
                      class="radius-chip py-2 text-xs font-semibold rounded-${r.value} border transition-all cursor-pointer ${
                        isSelected
                          ? `border-${primary}-600 bg-${primary}-500 text-white shadow-sm`
                          : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                      }"
                    >
                      ${r.label}
                    </button>
                  `;
                })
                .join('')}
            </div>

            <!-- 알림 메시지 영역 -->
            <div id="status-toast" class="mt-4 p-3 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
              💡 색상을 클릭하면 모든 스토리에 자동 반영됩니다.
            </div>
          </div>
        </div>

        <!-- 3. 실시간 컴포넌트 프리뷰 쇼케이스 -->
        <div class="space-y-6 pt-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold tracking-tight flex items-center gap-2">
              <span>✨</span> 실시간 컴포넌트 자동 적용 미리보기
            </h2>
            <span class="text-xs text-slate-500">테마 변경 시 즉시 다시 렌더링됩니다</span>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- 3-1. 버튼 쇼케이스 -->
            <div class="bg-white dark:bg-slate-800/80 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
              <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-700 pb-2">
                1. Button Variations (${primary})
              </h3>
              <div class="flex flex-wrap gap-3 items-center" id="preview-buttons">
                <!-- JS로 주입 -->
              </div>
            </div>

            <!-- 3-2. 뱃지 & 카드 쇼케이스 -->
            <div class="bg-white dark:bg-slate-800/80 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
              <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-700 pb-2">
                2. Badges & Form Elements
              </h3>
              <div class="flex flex-wrap gap-2.5 items-center">
                <span class="px-3 py-1 text-xs font-bold rounded-${radius} bg-${primary}-500 text-white shadow-sm">Primary Solid</span>
                <span class="px-3 py-1 text-xs font-bold rounded-${radius} bg-${primary}-100 text-${primary}-700 dark:bg-${primary}-950/80 dark:text-${primary}-300 border border-${primary}-300 dark:border-${primary}-800">Primary Soft</span>
                <span class="px-3 py-1 text-xs font-bold rounded-${radius} bg-${secondary}-100 text-${secondary}-700 dark:bg-${secondary}-950/80 dark:text-${secondary}-300 border border-${secondary}-300 dark:border-${secondary}-800">Secondary</span>
                <span class="px-3 py-1 text-xs font-bold rounded-${radius} border border-${primary}-500 text-${primary}-600 dark:text-${primary}-400">Outline</span>
              </div>

              <!-- 폼 인풋 프리뷰 -->
              <div class="space-y-3 pt-2">
                <label class="text-xs font-semibold text-slate-600 dark:text-slate-400 block">Theme Styled Input</label>
                <div class="flex gap-2">
                  <input
                    type="text"
                    value="포트폴리오 디자인시스템"
                    class="flex-1 px-3 py-2 text-sm rounded-${radius} border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-${primary}-500 focus:border-${primary}-500 transition-all"
                  />
                  <button class="px-4 py-2 text-sm font-semibold rounded-${radius} bg-${primary}-600 hover:bg-${primary}-700 text-white cursor-pointer transition-all">
                    확인
                  </button>
                </div>
              </div>
            </div>

            <!-- 3-3. 아코디언 쇼케이스 -->
            <div class="bg-white dark:bg-slate-800/80 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-700 pb-2">
                3. Accordion (${primary} 테마 적용)
              </h3>
              <div id="preview-accordion">
                <!-- 아코디언 렌더링 -->
              </div>
            </div>

            <!-- 3-4. 사이드메뉴 쇼케이스 -->
            <div class="bg-white dark:bg-slate-800/80 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-700 pb-2 flex items-center justify-between">
                <span>4. Multi-depth SideMenu (${primary} 테마)</span>
                <span class="text-[11px] font-normal text-slate-400">클릭하여 펼침/접힘 및 항목 선택</span>
              </h3>
              <div id="preview-sidemenu" class="flex justify-center">
                <!-- 사이드메뉴 렌더링 -->
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // 컴포넌트 동적 주입
    // 1) 버튼 주입
    const btnContainer = container.querySelector('#preview-buttons');
    if (btnContainer) {
      // Flat Button
      const flatBtn = createButton({
        label: 'Flat Button',
        size: 'medium',
        customClasses: `${buttonStyleTemplates.flat(primary).base} ${buttonStyleTemplates.flat(primary).hover} rounded-${radius}`,
      });
      // Outline Button
      const outlineBtn = createButton({
        label: 'Outline',
        size: 'medium',
        customClasses: `${buttonStyleTemplates.outline(primary).base} ${buttonStyleTemplates.outline(primary).hover} rounded-${radius}`,
      });
      // Pills Button
      const pillsBtn = createButton({
        label: 'Pills Style',
        size: 'medium',
        customClasses: `${buttonStyleTemplates.pills(primary).base} ${buttonStyleTemplates.pills(primary).hover}`,
      });
      // Gradient Button
      const gradientBtn = createButton({
        label: 'Gradient',
        size: 'medium',
        customClasses: `${buttonStyleTemplates.gradient(primary, secondary).base} ${buttonStyleTemplates.gradient(primary, secondary).hover} rounded-${radius}`,
      });

      btnContainer.appendChild(flatBtn);
      btnContainer.appendChild(outlineBtn);
      btnContainer.appendChild(pillsBtn);
      btnContainer.appendChild(gradientBtn);
    }

    // 2) 아코디언 주입
    const accContainer = container.querySelector('#preview-accordion');
    if (accContainer) {
      accContainer.innerHTML = createAccordion({
        baseColor: primary,
        items: [
          {
            title: `🎨 ${primary.toUpperCase()} 테마 아코디언 1`,
            contents: ['Theme Builder에서 색상을 변경하면 컴포넌트 색상이 즉시 변경됩니다.'],
          },
          {
            title: '🧩 디자인 시스템 토큰 연동',
            contents: ['컴포넌트마다 개별 코드를 수정할 필요 없이 전역 설정으로 일관성을 유지합니다.'],
          },
        ],
      });
    }

    // 3) 사이드메뉴 주입
    const sideMenuContainer = container.querySelector('#preview-sidemenu');
    if (sideMenuContainer) {
      const sideMenu = new SideMenu(sideMenuContainer);
      sideMenu.setBaseColor(primary);
      sideMenu.renderMenu([
        {
          id: 1,
          name: "Dashboard",
          children: [
            { id: 2, name: "Analytics" },
            { id: 3, name: "Reports" },
          ],
        },
        {
          id: 4,
          name: "Settings",
          children: [
            {
              id: 5,
              name: "Profile",
              children: [
                { id: 8, name: "Edit Profile" },
                { id: 11, name: "Change Avatar" },
              ],
            },
            { id: 6, name: "Security" },
          ],
        },
      ]);
    }

    // 이벤트 리스너 바인딩
    // 메인 컬러 칩 클릭
    container.querySelectorAll('.color-chip').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const color = btn.getAttribute('data-color');
        themeStore.setTheme({ primaryColor: color });
        showToast(`Primary 컬러가 '${color}'(으)로 변경되었습니다.`);
        renderContent();
      });
    });

    // 메인 컬러 드롭다운 변경
    const selectPrimary = container.querySelector('#select-primary');
    if (selectPrimary) {
      selectPrimary.addEventListener('change', (e) => {
        const color = e.target.value;
        themeStore.setTheme({ primaryColor: color });
        showToast(`Primary 컬러가 '${color}'(으)로 변경되었습니다.`);
        renderContent();
      });
    }

    // 보조 컬러 칩 클릭
    container.querySelectorAll('.secondary-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        const color = btn.getAttribute('data-secondary');
        themeStore.setTheme({ secondaryColor: color });
        showToast(`Secondary 컬러가 '${color}'(으)로 변경되었습니다.`);
        renderContent();
      });
    });

    // 곡률(Radius) 클릭
    container.querySelectorAll('.radius-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        const r = btn.getAttribute('data-radius');
        themeStore.setTheme({ borderRadius: r });
        showToast(`Border Radius가 '${r}'(으)로 변경되었습니다.`);
        renderContent();
      });
    });

    // JSON 내보내기 버튼
    const exportBtn = container.querySelector('#btn-export-json');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        themeStore.exportThemeJSON();
        showToast('✅ 표준 디자인 토큰(W3C DTCG)이 포함된 theme.json 파일이 다운로드되었습니다.');
      });
    }

    // JSON 불러오기 버튼
    const importBtn = container.querySelector('#btn-import-json');
    const importInput = container.querySelector('#input-import-json');
    if (importBtn && importInput) {
      importBtn.addEventListener('click', () => {
        importInput.value = '';
        importInput.click();
      });

      importInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);
            const applied = themeStore.importThemeJSON(data);
            if (applied) {
              showToast(`✅ '${applied.name || '새 테마'}' 설정이 성공적으로 적용되었습니다!`);
              renderContent();
            } else {
              showToast('⚠️ 올바르지 않은 테마 파일 형식입니다.');
            }
          } catch (err) {
            console.error('JSON Import Error:', err);
            showToast('❌ 테마 JSON 파일을 파싱하는 중 오류가 발생했습니다.');
          }
        };
        reader.readAsText(file);
      });
    }

    // 서버 색상 등록 버튼
    const saveServerBtn = container.querySelector('#btn-save-server');
    if (saveServerBtn) {
      saveServerBtn.addEventListener('click', async () => {
        showToast(`⏳ 시스템에 '${primary}' 색상 등록을 요청 중입니다...`);
        const result = await themeStore.registerColorToServer(primary);
        if (result.success) {
          showToast(`✅ [완료] ${result.message}`);
        } else {
          showToast(`⚠️ [참고] ${result.message} (로컬 dev 서버가 켜져 있으면 자동 저장됩니다)`);
        }
      });
    }

    // 초기화 버튼
    const resetBtn = container.querySelector('#btn-reset-theme');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        themeStore.resetTheme();
        showToast('테마가 기본값으로 초기화되었습니다.');
        renderContent();
      });
    }
  };

  const showToast = (message) => {
    const toast = container.querySelector('#status-toast');
    if (toast) {
      toast.innerHTML = message;
      toast.classList.add('ring-2', 'ring-blue-400');
      setTimeout(() => {
        toast.classList.remove('ring-2', 'ring-blue-400');
      }, 1500);
    }
  };

  renderContent();
  return container;
};
