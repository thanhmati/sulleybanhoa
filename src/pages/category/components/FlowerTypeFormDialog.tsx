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
import type { IFlowerType, ICreateFlowerTypePayload } from '@/types/catalog-metadata';

const flowerTypeSchema = z.object({
  name: z.string().min(2, 'Tên loại hoa phải từ 2 ký tự trở lên (VD: Rose, Tulip)'),
  description: z.string().optional(),
});

type FlowerTypeFormValues = z.infer<typeof flowerTypeSchema>;

interface FlowerTypeFormDialogProps {
  flowerType: IFlowerType | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ICreateFlowerTypePayload) => Promise<void>;
  isLoading?: boolean;
}

export function FlowerTypeFormDialog({
  flowerType,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: FlowerTypeFormDialogProps) {
  const form = useForm<FlowerTypeFormValues>({
    resolver: zodResolver(flowerTypeSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    if (flowerType) {
      form.reset({
        name: flowerType.name,
        description: flowerType.description || '',
      });
    } else {
      form.reset({
        name: '',
        description: '',
      });
    }
  }, [flowerType, form, isOpen]);

  const handleSubmitForm = async (data: FlowerTypeFormValues) => {
    await onSubmit({
      name: data.name,
      description: data.description || '',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>{flowerType ? 'Chỉnh Sửa Loại Hoa' : 'Thêm Loại Hoa Mới'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="ft-name">Tên loại hoa *</Label>
            <Input
              id="ft-name"
              {...form.register('name')}
              placeholder="VD: Rose, Tulip, Baby Breath"
            />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ft-description">Mô tả đặc tính</Label>
            <Textarea
              id="ft-description"
              {...form.register('description')}
              placeholder="Mô tả loại hoa, xuất xứ hoặc sắc màu..."
              rows={3}
            />
          </div>

          <DialogFooter className="pt-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="animate-spin mr-2" size={14} />}
              {flowerType ? 'Lưu cập nhật' : 'Tạo mới'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
