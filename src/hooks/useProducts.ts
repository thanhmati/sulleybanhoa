import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/productService';
import type { ProductFiltersParam, ICreateProductRequest } from '@/types/product';
import { toast } from 'sonner';

export const PRODUCT_QUERY_KEYS = {
  all: ['products'] as const,
  list: (filters?: ProductFiltersParam) => ['products', 'list', filters] as const,
  detail: (id: string) => ['products', 'detail', id] as const,
};

export function useProductsQuery(filters?: ProductFiltersParam) {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.list(filters),
    queryFn: () => productService.getProducts(filters),
  });
}

export function useProductDetailQuery(id: string) {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.detail(id),
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
  });
}

export function useCreateProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ICreateProductRequest) => productService.createProduct(payload),
    onSuccess: () => {
      toast.success('Thêm mới sản phẩm thành công!');
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.all });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Không thể tạo sản phẩm');
    },
  });
}

export function useUpdateProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ICreateProductRequest> }) =>
      productService.updateProduct(id, payload),
    onSuccess: (_, variables) => {
      toast.success('Cập nhật sản phẩm thành công!');
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.detail(variables.id) });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Không thể cập nhật sản phẩm');
    },
  });
}

export function useDeleteProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      toast.success('Xóa sản phẩm thành công!');
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.all });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Không thể xóa sản phẩm');
    },
  });
}
