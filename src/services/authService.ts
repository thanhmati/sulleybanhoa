import api from '@/lib/axios';
import {
  IChangePasswordRequest,
  ILoginRequest,
  ILoginResponse,
  IRefreshTokenRequest,
} from '@/types/auth';

export const authService = {
  login: async (data: ILoginRequest): Promise<ILoginResponse> => {
    const res = await api.post('/auth/login', data);
    return res.data;
  },

  refreshToken: async (refreshToken: string): Promise<IRefreshTokenRequest> => {
    const res = await api.post('/auth/refresh-token', { refreshToken });
    return res.data;
  },

  changePassword: async (body: IChangePasswordRequest): Promise<string> => {
    const res = await api.patch('/auth/change-password', body);
    return res.data;
  },
};
