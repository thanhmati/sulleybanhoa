import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/services/categoryService';
import type { ICreateCategoryPayload } from '@/types/catalog-metadata';
import { toast } from 'sonner';

export const CATEGORIES_QUERY_KEY = ['categories'];

export function useCategoriesQuery() {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: () => categoryService.getCategories(),
  });
}

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ICreateCategoryPayload) => categoryService.createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
      toast.success('Thêm danh mục mới thành công!');
    },
    onError: (err: Error) => {
      toast.error(`Thêm danh mục thất bại: ${err.message}`);
    },
  });
}

export function useUpdateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ICreateCategoryPayload> }) =>
      categoryService.updateCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
      toast.success('Cập nhật danh mục thành công!');
    },
    onError: (err: Error) => {
      toast.error(`Cập nhật danh mục thất bại: ${err.message}`);
    },
  });
}

export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
      toast.success('Xóa danh mục thành công!');
    },
    onError: (err: Error) => {
      toast.error(`Xóa danh mục thất bại: ${err.message}`);
    },
  });
}
