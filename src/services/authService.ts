import { supabase } from '@/lib/supabase';
import {
  IChangePasswordRequest,
  ILoginRequest,
  ILoginResponse,
  IRefreshTokenRequest,
} from '@/types/auth';

export const authService = {
  login: async (data: ILoginRequest): Promise<ILoginResponse> => {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) throw error;
    if (!authData.session) throw new Error('No session');
    return {
      accessToken: authData.session.access_token,
      refreshToken: authData.session.refresh_token,
      user: {
        id: authData.session.user.id,
        email: authData.session.user.email ?? '',
        fullName:
          authData.session.user.user_metadata?.full_name ||
          authData.session.user.user_metadata?.name ||
          '',
      },
    };
  },

  refreshToken: async (refreshToken: string): Promise<IRefreshTokenRequest> => {
    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
    if (error) throw error;
    if (!data.session) throw new Error('No session');
    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
    };
  },

  changePassword: async (body: IChangePasswordRequest): Promise<string> => {
    const { error } = await supabase.auth.updateUser({
      password: body.newPassword,
    });
    if (error) throw error;
    return 'Password changed successfully';
  },

  register: async (email: string, password: string, fullName: string): Promise<void> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    if (error) throw error;
  },
};
