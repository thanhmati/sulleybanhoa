import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { occasionService } from '@/services/occasionService';
import type { ICreateOccasionPayload } from '@/types/catalog-metadata';
import { toast } from 'sonner';

export const OCCASIONS_QUERY_KEY = ['occasions'];

export function useOccasionsQuery() {
  return useQuery({
    queryKey: OCCASIONS_QUERY_KEY,
    queryFn: () => occasionService.getOccasions(),
  });
}

export function useCreateOccasionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ICreateOccasionPayload) => occasionService.createOccasion(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OCCASIONS_QUERY_KEY });
      toast.success('Thêm dịp tặng mới thành công!');
    },
    onError: (err: Error) => {
      toast.error(`Thêm dịp tặng thất bại: ${err.message}`);
    },
  });
}

export function useUpdateOccasionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ICreateOccasionPayload> }) =>
      occasionService.updateOccasion(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OCCASIONS_QUERY_KEY });
      toast.success('Cập nhật dịp tặng thành công!');
    },
    onError: (err: Error) => {
      toast.error(`Cập nhật dịp tặng thất bại: ${err.message}`);
    },
  });
}

export function useDeleteOccasionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => occasionService.deleteOccasion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OCCASIONS_QUERY_KEY });
      toast.success('Xóa dịp tặng thành công!');
    },
    onError: (err: Error) => {
      toast.error(`Xóa dịp tặng thất bại: ${err.message}`);
    },
  });
}
