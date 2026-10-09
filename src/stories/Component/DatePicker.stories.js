import { createDatePicker } from './DatePicker';
import { themeStore } from '../themeStore';

export default {
  title: 'Theme Builder/Components/DatePicker',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
**DatePicker 컴포넌트**는 Theme Builder의 전역 Primary Color와 Border Radius를 **자동으로 상속**받아 선택된 날짜와 캘린더 헤더를 하이라이트합니다.  
Controls 패널에서는 색상 컨트롤 대신, **데이트피커 고유의 속성(id, 커스텀 클래스)**에 집중하여 설정할 수 있습니다.
        `,
      },
    },
  },
  argTypes: {
    id: {
      control: 'text',
      description: 'DatePicker HTML 식별자 ID',
      table: { category: '🧩 Configuration' },
    },
    customClasses: {
      control: 'text',
      description: '추가적인 커스텀 Tailwind 클래스 (탈출구)',
      table: { category: '🧩 Configuration' },
    },
  },
  args: {
    id: 'date-range-picker',
    customClasses: '',
  },
  render: (args) => {
    const { customClasses, id } = args;
    const effectiveBaseColor = themeStore.getActiveTheme().primaryColor || 'blue';

    return createDatePicker({ baseColor: effectiveBaseColor, customClasses, id });
  },
};

export const DefaultDatePicker = {
  args: {
    id: 'date-range-picker',
    customClasses: '',
  },
};
