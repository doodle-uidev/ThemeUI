// Button.stories.js
import { createButton } from "./Button";
import { buttonStyleTemplates } from "./ButtonStyle";
import { themeStore } from '../themeStore';

// 스타일 템플릿 적용 함수
const applyTemplateStyle = (templateFunc, baseColor, extraClass = "") => {
  const styleObj = templateFunc(baseColor);
  return [
    styleObj.base,
    styleObj.hover || "",
    styleObj.focus || "",
    extraClass,
  ].join(" ");
};

export default {
  title: 'Theme Builder/Components/Button',
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
**Button 컴포넌트**는 Theme Builder의 전역 설정(Primary Color, Secondary Color, Border Radius)을 **자동으로 상속**받습니다.  
Controls 패널에서는 색상이나 곡률 같은 전역 토큰 대신, **버튼 고유의 기능적 속성(라벨, 스타일 형태, 크기, 로딩, 비활성화, 아이콘)**에 집중하여 설정할 수 있습니다.
        `,
      },
    },
  },
  argTypes: {
    // 🧩 1. 컨텐츠 및 디자인 형태
    label: {
      control: "text",
      description: "버튼에 표시될 텍스트",
      table: { category: "🧩 Content & Design" },
    },
    variant: {
      control: { type: "select" },
      options: ["flat", "outline", "pills", "gradient", "light", "text"],
      description: "버튼 스타일 형태 (flat: 채움, outline: 테두리, pills: 알약형, gradient: 그라데이션, light: 연한 배경, text: 텍스트만)",
      table: { category: "🧩 Content & Design" },
    },
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
      description: "버튼 크기 (small, medium, large)",
      table: { category: "🧩 Content & Design" },
    },
    fullWidth: {
      control: "boolean",
      description: "가로 100% 전체 너비 확장 여부",
      table: { category: "🧩 Content & Design" },
    },

    // ⚡ 2. 상태 제어 (State)
    disabled: {
      control: "boolean",
      description: "버튼 비활성화 상태 (클릭 차단 및 불투명도 조절)",
      table: { category: "⚡ State (상태 제어)" },
    },
    loading: {
      control: "boolean",
      description: "로딩 상태 활성화 (회전 스피너 아이콘 표시)",
      table: { category: "⚡ State (상태 제어)" },
    },
    loadingText: {
      control: "text",
      description: "로딩 중 대체할 문구 (비워두면 기존 label 유지)",
      if: { arg: "loading", truthy: true },
      table: { category: "⚡ State (상태 제어)" },
    },

    // 🎯 3. 아이콘 설정 (Icon)
    icon: {
      control: "boolean",
      description: "아이콘 포함 여부",
      table: { category: "🎯 Icon (아이콘)" },
    },
    iconClass: {
      control: "text",
      description: "FontAwesome 또는 SVG 아이콘 클래스 (예: fas fa-arrow-right, fas fa-check)",
      if: { arg: "icon", truthy: true },
      table: { category: "🎯 Icon (아이콘)" },
    },
    iconPosition: {
      control: { type: "inline-radio" },
      options: ["left", "right"],
      description: "아이콘 배치 위치",
      if: { arg: "icon", truthy: true },
      table: { category: "🎯 Icon (아이콘)" },
    },

    // ⚙️ 4. 기타 및 이벤트
    customClasses: {
      control: "text",
      description: "추가적인 커스텀 Tailwind 클래스 (탈출구)",
      table: { category: "⚙️ Advanced" },
    },
    onClick: {
      action: "clicked",
      description: "버튼 클릭 이벤트 핸들러",
      table: { category: "⚙️ Advanced" },
    },
  },
  args: {
    label: "Button",
    variant: "flat",
    size: "medium",
    disabled: false,
    loading: false,
    loadingText: "처리 중...",
    icon: false,
    iconClass: "fas fa-paper-plane",
    iconPosition: "left",
    fullWidth: false,
    customClasses: "",
  },
  render: (args) => {
    const {
      label,
      size,
      variant,
      disabled,
      loading,
      loadingText,
      icon,
      iconClass,
      iconPosition,
      fullWidth,
      customClasses,
      onClick,
    } = args;

    // Theme Builder의 전역 테마 토큰을 100% 자동 상속
    const activeTheme = themeStore.getActiveTheme();
    const primary = activeTheme.primaryColor || "blue";
    const secondary = activeTheme.secondaryColor || "indigo";
    const radius = activeTheme.borderRadius || "md";

    let combinedClasses = customClasses || "";
    // pills 변형이 아니면 전역 radius 적용, pills면 rounded-full
    const roundedClass = variant === "pills" ? "rounded-full" : `rounded-${radius}`;
    const fullWidthClass = fullWidth ? "w-full" : "";

    // 스타일에 전역 색상 자동 적용
    if (variant === "flat") {
      combinedClasses = applyTemplateStyle(buttonStyleTemplates.flat, primary, combinedClasses);
    } else if (variant === "outline") {
      combinedClasses = applyTemplateStyle(buttonStyleTemplates.outline, primary, combinedClasses);
    } else if (variant === "pills") {
      combinedClasses = applyTemplateStyle(buttonStyleTemplates.pills, primary, combinedClasses);
    } else if (variant === "gradient") {
      combinedClasses = applyTemplateStyle(
        (base) => buttonStyleTemplates.gradient(base, secondary),
        primary,
        combinedClasses
      );
    } else if (variant === "text") {
      combinedClasses = applyTemplateStyle(buttonStyleTemplates.textOnly, primary, combinedClasses);
    } else if (variant === "light") {
      combinedClasses = applyTemplateStyle(buttonStyleTemplates.lightDefault, primary, combinedClasses);
    }

    combinedClasses = `${combinedClasses} ${roundedClass} ${fullWidthClass}`.trim();

    return createButton({
      label,
      size,
      customClasses: combinedClasses,
      disabled,
      loading,
      loadingText,
      icon,
      iconClass,
      iconPosition,
      onClick,
    });
  },
};

// 1. 기본 버튼 (전역 테마 자동 상속)
export const Default = {
  args: {
    label: "기본 버튼",
    variant: "flat",
    size: "medium",
  },
};

// 2. 아웃라인 버튼
export const Outline = {
  args: {
    label: "아웃라인 버튼",
    variant: "outline",
    size: "medium",
  },
};

// 3. 그라데이션 버튼 (전역 Primary + Secondary 컬러 조합)
export const Gradient = {
  args: {
    label: "그라데이션 버튼",
    variant: "gradient",
    size: "medium",
  },
};

// 4. 로딩 상태 버튼 (스피너 아이콘)
export const LoadingState = {
  args: {
    label: "데이터 저장",
    variant: "flat",
    loading: true,
    loadingText: "저장 중...",
  },
};

// 5. 비활성화 버튼
export const DisabledState = {
  args: {
    label: "비활성화 버튼",
    variant: "flat",
    disabled: true,
  },
};

// 6. 아이콘 포함 버튼
export const WithIcon = {
  args: {
    label: "메시지 전송",
    variant: "flat",
    icon: true,
    iconClass: "fas fa-paper-plane",
    iconPosition: "left",
  },
};

// 7. 가로 100% 확장 버튼
export const FullWidth = {
  args: {
    label: "전체 너비 버튼 (Full Width)",
    variant: "flat",
    fullWidth: true,
  },
};
