import { expect, userEvent, within } from '@storybook/test';
import { createPage } from './Page';

export default {
  title: 'Example/Page',
  tags: ['autodocs'],
  render: () => createPage(),
  parameters: {
    layout: 'fullscreen',
  },
};

export const LoggedOut = {
  render: () => createPage({ name: 'admin' }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Log in 버튼을 찾고 클릭
    const loginButton = await canvas.findByRole('button', { name: /Log in/i });
    await userEvent.click(loginButton);

    // 로그인 후, 'Log out' 버튼이 나타날 때까지 기다린다
    // const logoutButton = await canvas.findByRole('button', { name: /Log out/i });
    
    // // 'Log out' 버튼이 화면에 나타나야 한다는 것을 확인
    // await expect(logoutButton).toBeInTheDocument();
  },
};

export const LoggedIn = { // Pass initial user to be logged in
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Log out 버튼을 찾고 클릭
    const logoutButton = await canvas.findByRole('button', { name: /Log out/i });
    await userEvent.click(logoutButton);

    // 로그아웃 후 'Log in' 버튼이 나타날 때까지 기다린다
    // const loginButton = await canvas.findByRole('button', { name: /Log in/i });
    
    // // 'Log in' 버튼이 화면에 나타나야 한다는 것을 확인
    // await expect(loginButton).toBeInTheDocument();
  },
};
