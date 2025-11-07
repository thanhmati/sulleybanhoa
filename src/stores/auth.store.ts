import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  fullName: string;
  roles?: string[];
}

const defaultUser: User = {
  id: '',
  email: '',
  fullName: '',
};

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User;
  isAuthenticated: boolean;
  isVerifying: boolean;
  setAuth: (accessToken: string, refreshToken: string, user: User | null) => void;
  clearAuth: () => void;
  setVerifying: (v: boolean) => void;
  restoreAuth: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: defaultUser,
  isAuthenticated: false,
  isVerifying: true, // start verifying on app load
  setAuth: (accessToken, refreshToken, user) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    return set({
      accessToken,
      refreshToken,
      user: user ?? defaultUser,
      isAuthenticated: true,
      isVerifying: false,
    });
  },
  clearAuth: () =>
    set({
      accessToken: null,
      refreshToken: null,
      user: defaultUser,
      isAuthenticated: false,
      isVerifying: false,
    }),
  setVerifying: (v) => set({ isVerifying: v }),
  restoreAuth: () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    const user = localStorage.getItem('user');

    if (accessToken && refreshToken) {
      set({ accessToken, refreshToken, isAuthenticated: true });
    }

    if (user) {
      set({ user: JSON.parse(user) });
    }
  },
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    set({ user: defaultUser, accessToken: null, refreshToken: null, isAuthenticated: false });
  },
}));
