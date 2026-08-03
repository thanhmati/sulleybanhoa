import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import type { ICategory, ICreateCategoryPayload } from '@/types/catalog-metadata';

const categorySchema = z.object({
  name: z.string().min(2, 'Tên danh mục phải từ 2 ký tự trở lên (VD: Hoa bó, Giỏ hoa)'),
  description: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormDialogProps {
  category: ICategory | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ICreateCategoryPayload) => Promise<void>;
  isLoading?: boolean;
}

export function CategoryFormDialog({
  category,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: CategoryFormDialogProps) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        description: category.description || '',
      });
    } else {
      form.reset({
        name: '',
        description: '',
      });
    }
  }, [category, form, isOpen]);

  const handleSubmitForm = async (data: CategoryFormValues) => {
    await onSubmit({
      name: data.name,
      description: data.description || '',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>{category ? 'Chỉnh Sửa Danh Mục' : 'Thêm Danh Mục Mới'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="cat-name">Tên danh mục *</Label>
            <Input
              id="cat-name"
              {...form.register('name')}
              placeholder="VD: Hoa bó, Giỏ hoa, Hộp hoa"
            />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cat-description">Mô tả danh mục</Label>
            <Textarea
              id="cat-description"
              {...form.register('description')}
              placeholder="Mô tả chi tiết danh mục sản phẩm..."
              rows={3}
            />
          </div>

          <DialogFooter className="pt-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="animate-spin mr-2" size={14} />}
              {category ? 'Lưu cập nhật' : 'Tạo mới'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
