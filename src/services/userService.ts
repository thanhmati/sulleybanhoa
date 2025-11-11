import api from '@/lib/axios';
import { IUpdateUser, IUser, IUserListItem } from '@/types/user';

export const userService = {
  getMe: async (): Promise<IUser> => {
    const res = await api.get('/users/me');
    return res.data;
  },

  updateMe: async (data: IUpdateUser): Promise<IUser> => {
    const res = await api.patch('/users/me', data);
    return res.data;
  },

  getAll: async (): Promise<IUserListItem[]> => {
    const res = await api.get('/users');
    return res.data;
  },
};
