import api from '@/lib/axios';
import { ILoginRequest, ILoginResponse, IRefreshTokenRequest } from '@/types/auth';

export const authService = {
  login: async (data: ILoginRequest): Promise<ILoginResponse> => {
    const res = await api.post('/auth/login', data);
    return res.data;
  },

  refreshToken: async (refreshToken: string): Promise<IRefreshTokenRequest> => {
    const res = await api.post('/auth/refresh-token', { refreshToken });
    return res.data;
  },
};
