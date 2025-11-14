import api from '@/lib/axios';
import { ORDER_STATUS } from '@/lib/constants/order.constant';
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

  updateStatus: async (id: string, status: ORDER_STATUS): Promise<string> => {
    const res = await api.patch(`/orders/${id}/status`, { status });
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete(`/orders/${id}`);
    return res.data;
  },

  getById: async (id: string): Promise<Order> => {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  },
};
