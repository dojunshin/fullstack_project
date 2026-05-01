import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import api from '../utils/api';
import { User } from '../types/userType';
import type { UserStore } from '../types/userStoreType';

// React StrictMode 이중 호출 방지
let _sessionInitStarted = false;

export const useUserStore = create<UserStore>()(
  devtools(
    (set) => ({
      user: null,
      token: null,
      setUser: (user, token) => {
        set({ user, token });
        localStorage.setItem('hasSession', '1');
      },
      clearUser: () => {
        set({ user: null, token: null });
        localStorage.removeItem('hasSession');
      },
      initFromSession: async () => {
        if (_sessionInitStarted) return;
        _sessionInitStarted = true;
        if (!localStorage.getItem('hasSession')) return;
        try {
          const refreshRes = await api.post('/users/refresh');
          const newToken: string = refreshRes.data.accessToken;
          api.defaults.headers['authorization'] = 'Bearer ' + newToken;
          const userRes = await api.get('/users/me');
          const user: User | null = userRes?.data?.user || null;
          if (user) set({ user, token: newToken });
          else {
            set({ user: null, token: null });
            localStorage.removeItem('hasSession');
          }
        } catch {
          set({ user: null, token: null });
          localStorage.removeItem('hasSession');
        }
      },
    }),
    { name: 'UserStore' }
  )
);
