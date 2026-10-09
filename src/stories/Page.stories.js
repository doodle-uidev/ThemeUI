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
  render: () => createPage(null),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Log in 버튼을 찾고 클릭
    const loginButton = await canvas.findByRole('button', { name: /Log in/i });
    await userEvent.click(loginButton);
  },
};

export const LoggedIn = {
  render: () => createPage({ name: 'admin' }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Log out 버튼을 찾고 클릭
    const logoutButton = await canvas.findByRole('button', { name: /Log out/i });
    await userEvent.click(logoutButton);
  },
};
