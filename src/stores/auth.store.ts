import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

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
  restoreAuth: async () => {
    set({ isVerifying: true });
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        const user: User = {
          id: session.user.id,
          email: session.user.email ?? '',
          fullName: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
          roles: session.user.app_metadata?.roles || [],
        };
        set({
          accessToken: session.access_token,
          refreshToken: session.refresh_token,
          user,
          isAuthenticated: true,
          isVerifying: false,
        });
      } else {
        set({
          accessToken: null,
          refreshToken: null,
          user: defaultUser,
          isAuthenticated: false,
          isVerifying: false,
        });
      }
    } catch (error) {
      console.error('[restoreAuth] Error:', error);
      set({ isVerifying: false });
    }
  },
  logout: async () => {
    try {
      await supabase.auth.signOut();
      set({
        accessToken: null,
        refreshToken: null,
        user: defaultUser,
        isAuthenticated: false,
        isVerifying: false,
      });
    } catch (error) {
      console.error('[logout] Error:', error);
    }
  },
}));

// Subscribe to Supabase auth changes to sync the store
supabase.auth.onAuthStateChange((_event, session) => {
  if (session) {
    const user: User = {
      id: session.user.id,
      email: session.user.email ?? '',
      fullName: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
      roles: session.user.app_metadata?.roles || [],
    };
    useAuthStore.setState({
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      user,
      isAuthenticated: true,
      isVerifying: false,
    });
  } else {
    useAuthStore.setState({
      accessToken: null,
      refreshToken: null,
      user: defaultUser,
      isAuthenticated: false,
      isVerifying: false,
    });
  }
});
