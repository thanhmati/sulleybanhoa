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
  leadDays: z.number().min(0, 'Số ngày cần nhập trước phải >= 0'),
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
      leadDays: 0,
    },
  });

  useEffect(() => {
    if (flowerType) {
      form.reset({
        name: flowerType.name,
        description: flowerType.description || '',
        leadDays: flowerType.leadDays ?? 0,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        leadDays: 0,
      });
    }
  }, [flowerType, form, isOpen]);

  const handleSubmitForm = async (data: FlowerTypeFormValues) => {
    await onSubmit({
      name: data.name,
      description: data.description || '',
      leadDays: Number(data.leadDays) || 0,
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
            <div className="flex items-center justify-between">
              <Label htmlFor="ft-lead-days">Số ngày cần nhập trước</Label>
              <span className="text-[11px] text-muted-foreground">Mặc định: 0 ngày</span>
            </div>
            <Input
              id="ft-lead-days"
              type="number"
              min={0}
              step={1}
              {...form.register('leadDays', { valueAsNumber: true })}
              placeholder="0"
            />
            <p className="text-[11px] text-muted-foreground">
              Ví dụ: Hoa Ly cần chuẩn bị trước 2 ngày so với ngày giao thì điền 2. (0 = nhập trong
              ngày giao)
            </p>
            {form.formState.errors.leadDays && (
              <p className="text-xs text-destructive">{form.formState.errors.leadDays.message}</p>
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
