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
  user: User;
  isAuthenticated: boolean;
  isVerifying: boolean;
  setAuth: (token: string, user: User | null) => void;
  clearAuth: () => void;
  setVerifying: (v: boolean) => void;
  restoreAuth: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: defaultUser,
  isAuthenticated: false,
  isVerifying: true, // start verifying on app load
  setAuth: (token, user) =>
    set({
      accessToken: token,
      user: user ?? defaultUser,
      isAuthenticated: true,
      isVerifying: false,
    }),
  clearAuth: () =>
    set({ accessToken: null, user: defaultUser, isAuthenticated: false, isVerifying: false }),
  setVerifying: (v) => set({ isVerifying: v }),
  restoreAuth: () => {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');

    if (token) {
      set({ accessToken: token, isAuthenticated: true });
    }

    if (user) {
      set({ user: JSON.parse(user) });
    }
  },
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    set({ user: defaultUser, accessToken: null, isAuthenticated: false });
  },
}));
