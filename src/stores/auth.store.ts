import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  fullName?: string;
  roles?: string[];
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isVerifying: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  setVerifying: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isVerifying: true, // start verifying on app load
  setAuth: (token, user) =>
    set({ accessToken: token, user, isAuthenticated: true, isVerifying: false }),
  clearAuth: () =>
    set({ accessToken: null, user: null, isAuthenticated: false, isVerifying: false }),
  setVerifying: (v) => set({ isVerifying: v }),
}));
