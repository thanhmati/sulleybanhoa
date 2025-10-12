import api from '@/lib/axios';
import type { Order } from '@/types/order';

export const orderService = {
  getAll: async (): Promise<Order[]> => {
    const res = await api.get('/orders');
    return res.data;
  },

  create: async (data: Partial<Order>) => {
    const res = await api.post('/orders', data);
    return res.data;
  },

  update: async (id: string, data: Partial<Order>) => {
    const res = await api.patch(`/orders/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete(`/orders/${id}`);
    return res.data;
  },
};
