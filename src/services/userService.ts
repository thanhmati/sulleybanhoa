import api from '@/lib/axios';
import { IUpdateUser, IUser } from '@/types/user';

export const userService = {
  getMe: async (): Promise<IUser> => {
    const res = await api.get('/users/me');
    return res.data;
  },

  updateMe: async (data: IUpdateUser): Promise<IUser> => {
    const res = await api.patch('/users/me', data);
    return res.data;
  },
};
