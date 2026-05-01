import type { User } from './userType';

export interface UserStore {
  user: User | null;
  token: string | null;
  setUser: (user: User, token: string) => void;
  clearUser: () => void;
  initFromSession: () => Promise<void>;
}
