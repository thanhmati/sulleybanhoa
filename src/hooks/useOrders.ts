import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/orderService';
import type { IPayOrder, Order } from '@/types/order';
import { ORDER_STATUS } from '@/lib/constants/order.constant';

const ORDER_QUERY_KEY = ['orders'];
const ORDER_DETAIL_QUERY_KEY = ['order_detail'];

export function useOrdersQuery() {
  return useQuery<Order[]>({
    queryKey: ORDER_QUERY_KEY,
    queryFn: orderService.getAll,
  });
}

export function useOrderDetailQuery(orderId: string) {
  return useQuery<Order>({
    queryKey: ORDER_DETAIL_QUERY_KEY,
    queryFn: () => {
      return orderService.getById(orderId);
    },
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

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ORDER_STATUS }) =>
      orderService.updateStatus(id, status),
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

export function usePayOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IPayOrder }) => orderService.pay(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDER_DETAIL_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEY });
    },
  });
}
