import api from '@/lib/axios';
import { ICreateUser, IUpdateUser, IUpdateUserRoles, IUser, IUserListItem } from '@/types/user';

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

  getById: async (id: string): Promise<IUser> => {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },

  updateUserRoles: async (id: string, data: IUpdateUserRoles): Promise<string> => {
    const res = await api.patch(`/users/${id}/roles`, data);
    return res.data;
  },

  create: async (data: ICreateUser): Promise<string> => {
    const res = await api.post('/users', data);
    return res.data;
  },

  delete: async (id: string): Promise<string> => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  },
};
