import api from '@/lib/axios';
import { ILoginRequest, ILoginResponse } from '@/types/auth';

export const authService = {
  login: async (data: ILoginRequest): Promise<ILoginResponse> => {
    const res = await api.post('/auth/login', data);
    return res.data;
  },
};
