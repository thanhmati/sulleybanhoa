import { useState, useMemo, useCallback } from 'react';
import {
  useProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from '@/hooks/useProducts';
import { useCategoriesQuery } from '@/hooks/useCategories';
import { useFlowerTypesQuery } from '@/hooks/useFlowerTypes';
import { Product } from '@/types/product';
import { DataTable } from '@/components/ui/DataTable';
import { DataTableToolbar } from '@/components/ui/DataTableToolbar';
import { getProductColumns } from './components/columns';
import { ProductFormDialog } from './components/ProductFormDialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Button } from '@/components/ui/button';
import { PlusCircleIcon } from 'lucide-react';

export default function ProductListPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const { data: products = [], isLoading } = useProductsQuery();
  const { data: dbCategories = [] } = useCategoriesQuery();
  const { data: dbFlowerTypes = [] } = useFlowerTypesQuery();

  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();
  const deleteMutation = useDeleteProductMutation();

  const handleCreateOrUpdate = async (values: any) => {
    if (editingProduct) {
      await updateMutation.mutateAsync({ id: editingProduct.id, payload: values });
    } else {
      await createMutation.mutateAsync(values);
    }
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleToggleBestSeller = useCallback(
    async (product: Product, value: boolean) => {
      await updateMutation.mutateAsync({
        id: product.id,
        payload: { isBestSeller: value },
      });
    },
    [updateMutation],
  );

  const handleToggleNew = useCallback(
    async (product: Product, value: boolean) => {
      await updateMutation.mutateAsync({
        id: product.id,
        payload: { isNew: value },
      });
    },
    [updateMutation],
  );

  const handleDelete = async () => {
    if (deletingProduct) {
      await deleteMutation.mutateAsync(deletingProduct.id);
      setDeletingProduct(null);
    }
  };

  const columns = useMemo(
    () =>
      getProductColumns({
        dbCategories,
        dbFlowerTypes,
        onEdit: (product) => {
          setEditingProduct(product);
          setIsFormOpen(true);
        },
        onDelete: (product) => setDeletingProduct(product),
        onToggleBestSeller: handleToggleBestSeller,
        onToggleNew: handleToggleNew,
      }),
    [dbCategories, dbFlowerTypes, handleToggleBestSeller, handleToggleNew],
  );

  return (
    <div className="container mx-auto p-6">
      <DataTable
        isLoading={isLoading}
        columns={columns}
        data={products || []}
        externalState={{
          sorting: [{ id: 'name', desc: false }],
        }}
        toolbar={() => (
          <DataTableToolbar
            actions={
              <Button
                onClick={() => {
                  setEditingProduct(null);
                  setIsFormOpen(true);
                }}
              >
                <PlusCircleIcon className="mr-2 h-4 w-4" />
                Tạo sản phẩm
              </Button>
            }
          />
        )}
      />

      {/* Product Form Dialog */}
      <ProductFormDialog
        product={editingProduct}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleCreateOrUpdate}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={!!deletingProduct}
        onOpenChange={(open) => !open && setDeletingProduct(null)}
        title="Xác nhận xóa sản phẩm"
        description={`Bạn có chắc chắn muốn xóa sản phẩm "${deletingProduct?.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa sản phẩm"
        cancelText="Hủy"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
}
