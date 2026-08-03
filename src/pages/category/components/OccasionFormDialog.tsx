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
import type { IOccasion, ICreateOccasionPayload } from '@/types/catalog-metadata';

const occasionSchema = z.object({
  name: z.string().min(2, 'Tên dịp tặng phải từ 2 ký tự trở lên (VD: Birthday, Love)'),
  description: z.string().optional(),
});

type OccasionFormValues = z.infer<typeof occasionSchema>;

interface OccasionFormDialogProps {
  occasion: IOccasion | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ICreateOccasionPayload) => Promise<void>;
  isLoading?: boolean;
}

export function OccasionFormDialog({
  occasion,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: OccasionFormDialogProps) {
  const form = useForm<OccasionFormValues>({
    resolver: zodResolver(occasionSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    if (occasion) {
      form.reset({
        name: occasion.name,
        description: occasion.description || '',
      });
    } else {
      form.reset({
        name: '',
        description: '',
      });
    }
  }, [occasion, form, isOpen]);

  const handleSubmitForm = async (data: OccasionFormValues) => {
    await onSubmit({
      name: data.name,
      description: data.description || '',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>{occasion ? 'Chỉnh Sửa Dịp Tặng' : 'Thêm Dịp Tặng Mới'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="occ-name">Tên dịp tặng *</Label>
            <Input
              id="occ-name"
              {...form.register('name')}
              placeholder="VD: Birthday, Love, Anniversary"
            />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="occ-description">Mô tả dịp tặng</Label>
            <Textarea
              id="occ-description"
              {...form.register('description')}
              placeholder="Mô tả hoàn cảnh hoặc sự kiện tặng hoa..."
              rows={3}
            />
          </div>

          <DialogFooter className="pt-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="animate-spin mr-2" size={14} />}
              {occasion ? 'Lưu cập nhật' : 'Tạo mới'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
