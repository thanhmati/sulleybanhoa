import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/orderService';
import type { Order } from '@/types/order';

const ORDER_QUERY_KEY = ['orders'];

export function useOrdersQuery() {
  return useQuery<Order[]>({
    queryKey: ORDER_QUERY_KEY,
    queryFn: orderService.getAll,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orderService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEY }),
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Order> }) =>
      orderService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEY }),
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orderService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEY }),
  });
}
