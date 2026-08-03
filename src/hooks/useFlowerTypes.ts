import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { flowerTypeService } from '@/services/flowerTypeService';
import type { ICreateFlowerTypePayload } from '@/types/catalog-metadata';
import { toast } from 'sonner';

export const FLOWER_TYPES_QUERY_KEY = ['flower_types'];

export function useFlowerTypesQuery() {
  return useQuery({
    queryKey: FLOWER_TYPES_QUERY_KEY,
    queryFn: () => flowerTypeService.getFlowerTypes(),
  });
}

export function useCreateFlowerTypeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ICreateFlowerTypePayload) => flowerTypeService.createFlowerType(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FLOWER_TYPES_QUERY_KEY });
      toast.success('Thêm loại hoa mới thành công!');
    },
    onError: (err: Error) => {
      toast.error(`Thêm loại hoa thất bại: ${err.message}`);
    },
  });
}

export function useUpdateFlowerTypeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ICreateFlowerTypePayload> }) =>
      flowerTypeService.updateFlowerType(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FLOWER_TYPES_QUERY_KEY });
      toast.success('Cập nhật loại hoa thành công!');
    },
    onError: (err: Error) => {
      toast.error(`Cập nhật loại hoa thất bại: ${err.message}`);
    },
  });
}

export function useDeleteFlowerTypeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => flowerTypeService.deleteFlowerType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FLOWER_TYPES_QUERY_KEY });
      toast.success('Xóa loại hoa thành công!');
    },
    onError: (err: Error) => {
      toast.error(`Xóa loại hoa thất bại: ${err.message}`);
    },
  });
}
