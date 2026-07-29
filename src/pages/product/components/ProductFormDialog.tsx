import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, X, Loader2 } from 'lucide-react';
import { Product, ProductCategory } from '@/types/product';
import { productService } from '@/services/productService';
import { toast } from 'sonner';

const productSchema = z.object({
  name: z.string().min(2, 'Tên sản phẩm phải từ 2 ký tự trở lên'),
  price: z.coerce.number().min(1000, 'Giá sản phẩm phải lớn hơn 1.000 VNĐ'),
  category: z.enum(['bouquet', 'basket', 'box', 'plant', 'stand']),
  description: z.string().optional(),
  imageUrl: z.string().min(1, 'Vui lòng cung cấp hoặc tải lên hình ảnh sản phẩm'),
  isBestSeller: z.boolean().default(false),
  isNew: z.boolean().default(false),
  flowerTypeStr: z.string().optional(),
  occasionStr: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormDialogProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => Promise<void>;
  isLoading?: boolean;
}

export function ProductFormDialog({
  product,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: ProductFormDialogProps) {
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');

  const form = useForm<ProductFormValues, unknown, ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: '',
      price: 100000,
      category: 'bouquet',
      description: '',
      imageUrl: '',
      isBestSeller: false,
      isNew: false,
      flowerTypeStr: '',
      occasionStr: '',
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description || '',
        imageUrl: product.imageUrl,
        isBestSeller: product.isBestSeller ?? false,
        isNew: product.isNew ?? false,
        flowerTypeStr: (product.flowerType || []).join(', '),
        occasionStr: (product.occasion || []).join(', '),
      });
      setPreviewImage(product.imageUrl);
    } else {
      form.reset({
        name: '',
        price: 100000,
        category: 'bouquet',
        description: '',
        imageUrl: '',
        isBestSeller: false,
        isNew: false,
        flowerTypeStr: '',
        occasionStr: '',
      });
      setPreviewImage('');
    }
  }, [product, form, isOpen]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const publicUrl = await productService.uploadProductImage(file);
      form.setValue('imageUrl', publicUrl, { shouldValidate: true });
      setPreviewImage(publicUrl);
      toast.success('Tải ảnh lên thành công!');
    } catch (err: any) {
      toast.error(err.message || 'Tải ảnh thất bại');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitForm = async (data: ProductFormValues) => {
    const flowerType = data.flowerTypeStr
      ? data.flowerTypeStr
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    const occasion = data.occasionStr
      ? data.occasionStr
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    await onSubmit({
      name: data.name,
      price: data.price,
      category: data.category as ProductCategory,
      description: data.description || '',
      imageUrl: data.imageUrl,
      images: [data.imageUrl],
      flowerType,
      occasion,
      isBestSeller: data.isBestSeller,
      isNew: data.isNew,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{product ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(handleSubmitForm as SubmitHandler<ProductFormValues>)}
          className="space-y-4 py-2"
        >
          {/* Tên sản phẩm & Giá */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên sản phẩm *</Label>
              <Input id="name" {...form.register('name')} placeholder="VD: Sương Mai" />
              {form.formState.errors.name && (
                <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Giá bán (VNĐ) *</Label>
              <Input id="price" type="number" {...form.register('price')} placeholder="450000" />
              {form.formState.errors.price && (
                <p className="text-xs text-destructive">{form.formState.errors.price.message}</p>
              )}
            </div>
          </div>

          {/* Danh mục */}
          <div className="space-y-2">
            <Label htmlFor="category">Danh mục *</Label>
            <Select
              value={form.watch('category')}
              onValueChange={(val) => form.setValue('category', val as ProductCategory)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bouquet">Hoa bó</SelectItem>
                <SelectItem value="basket">Giỏ hoa</SelectItem>
                <SelectItem value="box">Hộp hoa</SelectItem>
                <SelectItem value="plant">Cây & Lan</SelectItem>
                <SelectItem value="stand">Kệ hoa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Image Upload Area */}
          <div className="space-y-2">
            <Label>Hình ảnh sản phẩm *</Label>
            <div className="flex gap-3 items-center">
              {previewImage ? (
                <div className="relative w-16 h-20 rounded border border-border shrink-0 overflow-hidden bg-muted">
                  <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewImage('');
                      form.setValue('imageUrl', '');
                    }}
                    className="absolute top-1 right-1 p-0.5 rounded-full bg-background/80 text-foreground hover:bg-background"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <label className="w-full h-20 rounded border border-dashed border-input hover:border-accent bg-card flex flex-col items-center justify-center cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                  {uploading ? (
                    <div className="flex items-center gap-2 text-xs">
                      <Loader2 className="animate-spin" size={16} /> Đang tải ảnh...
                    </div>
                  ) : (
                    <>
                      <Upload size={18} className="mb-1" />
                      <span className="text-xs">Bấm để chọn file tải lên</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              )}
            </div>
            <Input
              {...form.register('imageUrl')}
              placeholder="Hoặc dán URL ảnh..."
              onChange={(e) => setPreviewImage(e.target.value)}
            />
            {form.formState.errors.imageUrl && (
              <p className="text-xs text-destructive">{form.formState.errors.imageUrl.message}</p>
            )}
          </div>

          {/* Loại hoa & Dịp tặng */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="flowerTypeStr">Loại hoa (phân cách dấu phẩy)</Label>
              <Input
                id="flowerTypeStr"
                {...form.register('flowerTypeStr')}
                placeholder="Rose, Tulip"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="occasionStr">Dịp tặng (phân cách dấu phẩy)</Label>
              <Input
                id="occasionStr"
                {...form.register('occasionStr')}
                placeholder="Birthday, Love"
              />
            </div>
          </div>

          {/* Mô tả */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả sản phẩm</Label>
            <Input
              id="description"
              {...form.register('description')}
              placeholder="Mô tả ngắn gọn..."
            />
          </div>

          {/* Switches for Best Seller & New */}
          <div className="flex gap-6 pt-2 border-t border-border">
            <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
              <Checkbox
                checked={form.watch('isBestSeller')}
                onCheckedChange={(checked) => form.setValue('isBestSeller', !!checked)}
              />
              Bán chạy
            </label>
            <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
              <Checkbox
                checked={form.watch('isNew')}
                onCheckedChange={(checked) => form.setValue('isNew', !!checked)}
              />
              Sản phẩm Mới
            </label>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading || uploading}>
              {isLoading && <Loader2 className="animate-spin mr-2" size={14} />}
              {product ? 'Lưu cập nhật' : 'Tạo mới'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
