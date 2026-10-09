import { fn } from '@storybook/test';
import { createHeader } from './Header';

export default {
  title: 'Example/Header',
  tags: ['autodocs'],
  render: (args) => {
    if (args.isNHLoggedOut) {
      // NH Logged Out 상태에서는 GNB를 렌더링하지 않고, 주어진 마크업만 반환
      const container = document.createElement('div');
      container.innerHTML = `
        <div class="relative grid min-h-screen grid-cols-[1fr_2.5rem_auto_2.5rem_1fr] grid-rows-[1fr_1px_auto_1px_1fr] bg-white [--pattern-fg:var(--color-gray-950)]/5 dark:bg-gray-950 dark:[--pattern-fg:var(--color-white)]/10">
          <div class="col-start-3 row-start-3 flex max-w-lg flex-col p-2 dark:bg-white/10 min-w-[390px]">
            <div class="w-full p-6 bg-white borderrounded-xl sm:p-8 dark:bg-gray-800 ">
              <form class="space-y-6" action="/login" method="post">
                <h3 class="login-logo text-xl font-medium font-bold text-center text-gray-900 dark:text-white">WINHUB LOGIN</h3>
                <div>
                  <label for="id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">ID</label>
                  <input type="text" id="id" name="id" value="user" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="">
                </div>
                <div>
                  <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Password</label>
                  <input type="password" name="password" value="12345" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required="">
                </div>
                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input id="remember" aria-describedby="remember" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800">
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="remember" class="font-medium text-gray-900 dark:text-gray-300">ID 저장하기</label>
                  </div>
                  <a href="#" class="ml-auto text-sm text-blue-700 hover:underline dark:text-blue-500">패스워드 찾기</a>
                </div>
                <button type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login</button>
                <div class="text-sm font-medium text-gray-500 dark:text-gray-300">Not registered? <a href="#" class="text-blue-700 hover:underline dark:text-blue-500">Create account</a></div>
              </form>
            </div>
          </div>
          <div class="relative -right-px border-gray-200 col-start-2 row-span-full row-start-1 border-x border-x-(--pattern-fg) bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed"></div>
          <div class="relative -left-px border-gray-200 col-start-4 row-span-full row-start-1 border-x border-x-(--pattern-fg) bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed"></div>
          <div class="relative -bottom-px col-span-full col-start-1 row-start-2 h-px bg-(--pattern-fg)"></div>
          <div class="relative -top-px col-span-full col-start-1 row-start-4 h-px bg-(--pattern-fg)"></div>
        </div>
      `;
      return container;
    }
    return createHeader(args);
  },
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onLogin: fn(),
    onLogout: fn(),
    onCreateAccount: fn(),
  },
};

export const LoggedIn = {
  args: {
    user: {
      name: 'admin',
    },
    onLogout: () => alert('Logged out!'),
  },
};

export const LoggedOut = {
  args: {
    onLogin: () => alert('Logged in!'),
    onCreateAccount: () => alert('Sign up!'),
  },
};

export const NHLoggedOut = {
  args: {
    isNHLoggedOut: true, // NH Logged Out 상태를 나타내는 플래그
  },
};
