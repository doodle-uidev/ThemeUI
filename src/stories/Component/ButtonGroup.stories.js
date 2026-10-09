import createButtonGroup from "./ButtonGroup";
import { themeStore } from '../themeStore';

export default {
  title: 'Theme Builder/Components/ButtonGroup',
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
**ButtonGroup 컴포넌트**는 Theme Builder의 전역 Primary Color와 Border Radius를 **자동으로 상속**받습니다.  
Controls 패널에서는 색상이나 곡률 대신, **버튼 그룹 고유의 크기(size), 아이콘(icon), 풀너비(fullWidth)** 설정에 집중하여 제어할 수 있습니다.
        `,
      },
    },
  },
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
      description: "버튼 그룹 크기",
      table: { category: "🧩 Size & Layout" },
    },
    fullWidth: {
      control: "boolean",
      description: "가로 100% 전체 너비 확장",
      table: { category: "🧩 Size & Layout" },
    },
    icon: {
      control: "boolean",
      description: "버튼에 아이콘 표시 여부",
      table: { category: "🎯 Icon (아이콘)" },
    },
    iconPosition: {
      control: { type: "inline-radio" },
      options: ["left", "right"],
      description: "아이콘 배치 위치",
      if: { arg: "icon", truthy: true },
      table: { category: "🎯 Icon (아이콘)" },
    },
  },
  args: {
    size: "medium",
    fullWidth: false,
    icon: false,
    iconPosition: "left",
  },
  render: (args) => {
    const { size, fullWidth, icon, iconPosition } = args;

    // Theme Builder의 전역 테마 토큰 자동 상속
    const activeTheme = themeStore.getActiveTheme();
    const effectiveColor = activeTheme.primaryColor || "blue";
    const effectiveRadius = activeTheme.borderRadius || "md";

    const buttons = [
      { label: "Profile", icon, iconClass: "fas fa-user", iconPosition },
      { label: "Settings", icon, iconClass: "fas fa-cog", iconPosition },
      { label: "Messages", icon, iconClass: "fas fa-envelope", iconPosition },
    ];

    return createButtonGroup({
      buttons,
      color: effectiveColor,
      rounded: effectiveRadius,
      size,
      fullWidth,
    });
  },
};

export const DefaultButtonGroup = {
  args: {
    size: "medium",
    fullWidth: false,
    icon: false,
  },
};

export const IconButtonGroup = {
  args: {
    size: "medium",
    fullWidth: false,
    icon: true,
    iconPosition: "left",
  },
};
