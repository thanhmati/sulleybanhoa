import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { Order } from '@/types/order';

export function useOrdersQuery() {
  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data } = await axios.get('http://localhost:3030/api/v1/orders');
      return data;
    },
  });
}
