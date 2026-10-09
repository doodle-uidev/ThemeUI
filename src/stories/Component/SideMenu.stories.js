// SideMenu.stories.js
import { SideMenu } from "./SideMenu";
import { themeStore } from '../themeStore';

export default {
  title: 'Theme Builder/Components/SideMenu',
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
**SideMenu 컴포넌트**는 Theme Builder의 전역 Primary Color와 Border Radius를 **자동으로 상속**받아 1depth 활성 메뉴의 배경 및 인디케이터를 표현합니다.  
Controls 패널에서는 색상 컨트롤 대신, **사이드메뉴 계층 구조 데이터(menuData)**에 집중하여 설정할 수 있습니다.
        `,
      },
    },
  },
  argTypes: {
    // 🧩 1. 메뉴 계층 트리 데이터
    menuData: {
      control: "object",
      description: "1depth ~ 3depth 계층 구조를 가지는 사이드메뉴 데이터 배열",
      table: { category: "🧩 Navigation & Data" },
    },
  },
  args: {
    menuData: [
      {
        id: 1,
        name: "Dashboard",
        label: "대시보드",
        link: "/dashboard",
        depth: "1",
        children: [
          {
            id: 2,
            name: "Analytics",
            label: "통계 및 분석",
            link: "/dashboard/analytics",
            depth: "2",
            children: [
              { id: 7, name: "Traffic", label: "트래픽 현황", link: "/dashboard/analytics/traffic", depth: "3" },
              { id: 10, name: "Region", label: "지역별 접속자", link: "/dashboard/analytics/region", depth: "3" },
            ],
          },
          { id: 3, name: "Reports", label: "월간 리포트", link: "/dashboard/reports", depth: "2" },
        ],
      },
      {
        id: 4,
        name: "Settings",
        label: "환경 설정",
        link: "/settings",
        depth: "1",
        children: [
          {
            id: 5,
            name: "Profile",
            label: "내 프로필",
            link: "/settings/profile",
            depth: "2",
            children: [
              { id: 8, name: "Edit Profile", label: "정보 수정", link: "/settings/profile/edit", depth: "3" },
              { id: 11, name: "Avatar", label: "프로필 사진", link: "/settings/profile/avatar", depth: "3" },
            ],
          },
          { id: 6, name: "Security", label: "보안 및 암호", link: "/settings/security", depth: "2" },
        ],
      },
      {
        id: 12,
        name: "Help Center",
        label: "도움말 및 지원",
        link: "/help",
        depth: "1",
      },
    ],
  },
};

const Template = (args) => {
  const activeColor = themeStore.getActiveTheme().primaryColor || 'blue';
  const container = document.createElement("div");
  container.className = "w-full max-w-[300px] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm bg-white dark:bg-slate-900 p-2";

  const sideMenu = new SideMenu(container);
  sideMenu.setBaseColor(activeColor);
  sideMenu.renderMenu(args.menuData);

  return container;
};

export const Default = Template.bind({});
Default.args = {};