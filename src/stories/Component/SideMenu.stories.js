// SideMenu.stories.js
import { SideMenu } from "./SideMenu";
import { themeStore } from '../themeStore';

// maxDepth(1~4)에 맞춰 계층 트리를 동적으로 정제하는 헬퍼 함수
function filterMenuByDepth(items, maxDepth = 4, currentDepth = 1) {
  if (!Array.isArray(items)) return [];
  return items.map((item) => {
    const copy = { ...item };
    if (currentDepth < maxDepth && Array.isArray(item.children) && item.children.length > 0) {
      copy.children = filterMenuByDepth(item.children, maxDepth, currentDepth + 1);
    } else {
      delete copy.children;
    }
    return copy;
  });
}

// 4depth까지 지원하는 상세 메뉴 트리 데이터
const full4DepthMenuData = [
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
          {
            id: 7,
            name: "Traffic",
            label: "트래픽 현황",
            link: "/dashboard/analytics/traffic",
            depth: "3",
            children: [
              { id: 13, name: "LiveTraffic", label: "실시간 트래픽 (4depth)", link: "/dashboard/analytics/traffic/live", depth: "4" },
              { id: 14, name: "History", label: "기간별 통계 (4depth)", link: "/dashboard/analytics/traffic/history", depth: "4" },
            ],
          },
          {
            id: 10,
            name: "Region",
            label: "지역별 접속자",
            link: "/dashboard/analytics/region",
            depth: "3",
            children: [
              { id: 15, name: "Domestic", label: "국내 접속자 (4depth)", link: "/dashboard/analytics/region/domestic", depth: "4" },
              { id: 16, name: "Overseas", label: "해외 접속자 (4depth)", link: "/dashboard/analytics/region/overseas", depth: "4" },
            ],
          },
        ],
      },
      {
        id: 3,
        name: "Reports",
        label: "매출 및 결제 리포트",
        link: "/dashboard/reports",
        depth: "2",
        children: [
          {
            id: 17,
            name: "Sales",
            label: "주문 채널별 분석",
            link: "/dashboard/reports/sales",
            depth: "3",
            children: [
              { id: 18, name: "OnlineOrder", label: "온라인 주문 내역 (4depth)", link: "/dashboard/reports/sales/online", depth: "4" },
              { id: 19, name: "StorePos", label: "오프라인 POS 내역 (4depth)", link: "/dashboard/reports/sales/pos", depth: "4" },
            ],
          },
        ],
      },
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
          {
            id: 8,
            name: "Edit Profile",
            label: "계정 정보 관리",
            link: "/settings/profile/edit",
            depth: "3",
            children: [
              { id: 20, name: "BasicInfo", label: "기본 정보 변경 (4depth)", link: "/settings/profile/edit/basic", depth: "4" },
              { id: 21, name: "Password", label: "비밀번호 재설정 (4depth)", link: "/settings/profile/edit/password", depth: "4" },
            ],
          },
          { id: 11, name: "Avatar", label: "프로필 사진 설정", link: "/settings/profile/avatar", depth: "3" },
        ],
      },
      {
        id: 6,
        name: "Security",
        label: "보안 센터",
        link: "/settings/security",
        depth: "2",
        children: [
          {
            id: 22,
            name: "TwoFactor",
            label: "2단계 인증 (2FA)",
            link: "/settings/security/2fa",
            depth: "3",
            children: [
              { id: 23, name: "OtpApp", label: "인증 앱(OTP) 등록 (4depth)", link: "/settings/security/2fa/otp", depth: "4" },
              { id: 24, name: "SmsBackup", label: "SMS 백업 인증 (4depth)", link: "/settings/security/2fa/sms", depth: "4" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 12,
    name: "Help Center",
    label: "도움말 및 지원",
    link: "/help",
    depth: "1",
  },
];

export default {
  title: 'Theme Builder/Components/SideMenu',
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
**SideMenu 컴포넌트**는 Theme Builder의 전역 Primary Color와 Border Radius를 **자동으로 상속**받으며,  
**최대 4depth까지의 계층 구조**를 지원합니다.

Controls 패널의 **\`maxDepth\` 옵션(1 ~ 4)**을 통해 표시할 메뉴 깊이를 자유롭게 제어할 수 있습니다.
- **1depth**: 대메뉴 루트 항목만 표시
- **2depth**: 1depth + 2depth 서브메뉴 아코디언 표시
- **3depth**: 1depth + 2depth + 3depth 토글 패널 표시
- **4depth**: 1depth ~ 4depth 전체 계층 트리 (4depth 전용 불릿 인디케이터 적용)
        `,
      },
    },
  },
  argTypes: {
    // ⚙️ 1. 최대 표시 Depth 제어 옵션
    maxDepth: {
      control: { type: "inline-radio" },
      options: [1, 2, 3, 4],
      description: "사이드메뉴 계층 깊이 제한 (1depth ~ 4depth)",
      table: {
        category: "⚙️ 계층 Depth 옵션",
        defaultValue: { summary: "3" },
      },
    },
    // 🧩 2. 메뉴 계층 트리 데이터
    menuData: {
      control: "object",
      description: "1depth ~ 4depth 계층 구조를 가지는 사이드메뉴 데이터 배열",
      table: { category: "🧩 Navigation & Data" },
    },
  },
  args: {
    maxDepth: 3,
    menuData: full4DepthMenuData,
  },
};

const Template = (args) => {
  const activeColor = themeStore.getActiveTheme().primaryColor || 'blue';
  const container = document.createElement("div");
  container.className = "w-full max-w-[320px] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm bg-white dark:bg-slate-900 p-2";

  const maxDepth = Number(args.maxDepth) || 3;
  const filteredData = filterMenuByDepth(args.menuData, maxDepth);

  const sideMenu = new SideMenu(container);
  sideMenu.setBaseColor(activeColor);
  sideMenu.renderMenu(filteredData, maxDepth);

  return container;
};

// 1. 기본 스토리 (Controls에서 maxDepth 1~4 자유롭게 변경 가능)
export const Default = Template.bind({});
Default.args = {
  maxDepth: 3,
};

// 2. 4depth 전체 계층 스토리 (1depth -> 2depth -> 3depth -> 4depth)
export const Depth4_FullHierarchy = Template.bind({});
Depth4_FullHierarchy.storyName = "Depth 4 (전체 계층 트리)";
Depth4_FullHierarchy.args = {
  maxDepth: 4,
};

// 3. 3depth 스토리 (표준 계층)
export const Depth3_Standard = Template.bind({});
Depth3_Standard.storyName = "Depth 3 (표준 3계층)";
Depth3_Standard.args = {
  maxDepth: 3,
};

// 4. 2depth 스토리 (간소화 서브메뉴)
export const Depth2_Compact = Template.bind({});
Depth2_Compact.storyName = "Depth 2 (컴팩트 2계층)";
Depth2_Compact.args = {
  maxDepth: 2,
};

// 5. 1depth 스토리 (루트 단독 메뉴)
export const Depth1_RootOnly = Template.bind({});
Depth1_RootOnly.storyName = "Depth 1 (루트 전용 메뉴)";
Depth1_RootOnly.args = {
  maxDepth: 1,
};