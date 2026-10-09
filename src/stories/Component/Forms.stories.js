// Form.stories.js
import { Forms, Textarea, SelectInput, FileUpload, LoginForm, ToggleSwitch } from './Forms';
import { themeStore } from '../themeStore';

export default {
  title: 'Theme Builder/Components/Forms',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
**Forms 컴포넌트**는 Theme Builder의 전역 Primary Color(포커스 링, 스위치 활성 색상)와 Border Radius를 **자동으로 상속**받습니다.  
Controls 패널에서는 폼 필드의 크기(size) 등 고유 속성에 집중하여 설정할 수 있습니다.
        `,
      },
    },
  },
  argTypes: {
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md', 'lg'],
      description: '인풋 필드 및 라벨 크기 스케일',
      table: { category: '📐 Layout & Size' },
    },
  },
  args: {
    size: 'md',
  },
};

const withTheme = (args) => {
  const activeTheme = themeStore.getActiveTheme();
  return {
    ...args,
    baseColor: activeTheme.primaryColor || 'blue',
    rounded: activeTheme.borderRadius || 'md',
  };
};

// 1. 기본 인풋 폼
const TemplateForms = (args) => Forms(withTheme(args));
export const InputFields = TemplateForms.bind({});
InputFields.args = { size: 'md' };

// 2. 로그인 폼
const TemplateLogin = (args) => LoginForm(withTheme(args));
export const Login = TemplateLogin.bind({});
Login.args = { size: 'md' };

// 3. 텍스트에어리어
const TemplateTextarea = (args) => Textarea(withTheme(args));
export const TextArea = TemplateTextarea.bind({});
TextArea.args = { size: 'md' };

// 4. 셀렉트 인풋
const TemplateSelectInput = (args) => SelectInput(withTheme(args));
export const SelectDropdown = TemplateSelectInput.bind({});
SelectDropdown.args = { size: 'md' };

// 5. 토글 스위치
const TemplateToggle = (args) => ToggleSwitch(withTheme(args));
export const Switch = TemplateToggle.bind({});
Switch.args = { size: 'md' };
