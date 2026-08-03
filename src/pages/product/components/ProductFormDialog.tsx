import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Upload,
  X,
  Loader2,
  Check,
  Plus,
  Image as ImageIcon,
  Tag,
  Sparkles,
  Flame,
  Package,
  Star,
} from 'lucide-react';
import { Product, ProductCategory } from '@/types/product';
import { productService } from '@/services/productService';
import { useCategoriesQuery } from '@/hooks/useCategories';
import { useFlowerTypesQuery } from '@/hooks/useFlowerTypes';
import { useOccasionsQuery } from '@/hooks/useOccasions';
import { formatCurrency } from '@/lib/utils/formatters';
import { toast } from 'sonner';

const productSchema = z.object({
  name: z.string().min(2, 'Tên sản phẩm phải từ 2 ký tự trở lên'),
  price: z.coerce.number().min(1000, 'Giá sản phẩm phải lớn hơn 1.000 VNĐ'),
  category: z.string().min(1, 'Vui lòng chọn danh mục'),
  description: z.string().optional(),
  imageUrl: z.string().min(1, 'Vui lòng cung cấp hoặc tải lên hình ảnh đại diện'),
  isBestSeller: z.boolean().default(false),
  isNew: z.boolean().default(false),
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
  const [imageList, setImageList] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState<string>('');
  const [selectedFlowerTypeIds, setSelectedFlowerTypeIds] = useState<string[]>([]);
  const [selectedOccasionIds, setSelectedOccasionIds] = useState<string[]>([]);
  const [customFlowerTypeInput, setCustomFlowerTypeInput] = useState('');
  const [customOccasionInput, setCustomOccasionInput] = useState('');

  // Queries from DB
  const { data: categories = [] } = useCategoriesQuery();
  const { data: dbFlowerTypes = [] } = useFlowerTypesQuery();
  const { data: dbOccasions = [] } = useOccasionsQuery();

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
    },
  });

  const priceValue = form.watch('price');
  const currentCoverUrl = form.watch('imageUrl');

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
      });

      // Initialize image gallery list
      const initialImages =
        product.images && product.images.length > 0
          ? product.images
          : product.imageUrl
            ? [product.imageUrl]
            : [];
      setImageList(initialImages);

      // Map existing product flowerType values to UUIDs if available
      const rawFt = product.flowerType || [];
      const mappedFtIds = rawFt.map((val) => {
        const found = dbFlowerTypes.find((ft) => ft.id === val || ft.name === val);
        return found ? found.id : val;
      });
      setSelectedFlowerTypeIds(mappedFtIds);

      // Map existing product occasion values to UUIDs if available
      const rawOcc = product.occasion || [];
      const mappedOccIds = rawOcc.map((val) => {
        const found = dbOccasions.find((o) => o.id === val || o.name === val);
        return found ? found.id : val;
      });
      setSelectedOccasionIds(mappedOccIds);
    } else {
      form.reset({
        name: '',
        price: 450000,
        category: categories[0]?.key || 'bouquet',
        description: '',
        imageUrl: '',
        isBestSeller: false,
        isNew: false,
      });
      setImageList([]);
      setUrlInput('');
      setSelectedFlowerTypeIds([]);
      setSelectedOccasionIds([]);
    }
  }, [product, form, isOpen, categories, dbFlowerTypes, dbOccasions]);

  const toggleFlowerType = (id: string) => {
    setSelectedFlowerTypeIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleOccasion = (id: string) => {
    setSelectedOccasionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const addCustomFlowerType = () => {
    const trimmed = customFlowerTypeInput.trim();
    if (trimmed && !selectedFlowerTypeIds.includes(trimmed)) {
      setSelectedFlowerTypeIds((prev) => [...prev, trimmed]);
      setCustomFlowerTypeInput('');
    }
  };

  const addCustomOccasion = () => {
    const trimmed = customOccasionInput.trim();
    if (trimmed && !selectedOccasionIds.includes(trimmed)) {
      setSelectedOccasionIds((prev) => [...prev, trimmed]);
      setCustomOccasionInput('');
    }
  };

  const handleMultipleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      setUploading(true);
      const newUploadedUrls: string[] = [];

      for (const file of files) {
        const publicUrl = await productService.uploadProductImage(file);
        newUploadedUrls.push(publicUrl);
      }

      const updatedList = [...imageList, ...newUploadedUrls];
      setImageList(updatedList);

      // Auto-set the first image as main cover image if empty
      if (!form.getValues('imageUrl') && updatedList[0]) {
        form.setValue('imageUrl', updatedList[0], { shouldValidate: true });
      }

      toast.success(`Tải thành công ${newUploadedUrls.length} hình ảnh!`);
    } catch (err: any) {
      toast.error(err.message || 'Tải ảnh thất bại');
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset file input
    }
  };

  const handleAddImageUrl = () => {
    const trimmed = urlInput.trim();
    if (trimmed) {
      if (imageList.includes(trimmed)) {
        toast.error('URL hình ảnh này đã tồn tại trong bộ sưu tập');
        return;
      }
      const updatedList = [...imageList, trimmed];
      setImageList(updatedList);

      if (!form.getValues('imageUrl')) {
        form.setValue('imageUrl', trimmed, { shouldValidate: true });
      }

      setUrlInput('');
      toast.success('Đã thêm hình ảnh từ URL!');
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const removedUrl = imageList[indexToRemove];
    const updatedList = imageList.filter((_, idx) => idx !== indexToRemove);
    setImageList(updatedList);

    // If the cover image was removed, re-assign cover image to the first available image
    if (currentCoverUrl === removedUrl) {
      const newCover = updatedList[0] || '';
      form.setValue('imageUrl', newCover, { shouldValidate: true });
    }
  };

  const handleSetAsCover = (url: string) => {
    form.setValue('imageUrl', url, { shouldValidate: true });
    toast.success('Đã chọn làm ảnh đại diện chính!');
  };

  const handleSubmitForm = async (data: ProductFormValues) => {
    const selectedCategoryObj = categories.find((c) => (c.key || c.id) === data.category);
    const coverUrl = data.imageUrl || imageList[0] || '';

    // Ensure coverUrl is inside imageList
    const finalImages = [...imageList];
    if (coverUrl && !finalImages.includes(coverUrl)) {
      finalImages.unshift(coverUrl);
    }

    await onSubmit({
      name: data.name,
      price: data.price,
      category: data.category as ProductCategory,
      categoryId: selectedCategoryObj?.id,
      description: data.description || '',
      imageUrl: coverUrl,
      images: finalImages,
      flowerType: selectedFlowerTypeIds,
      occasion: selectedOccasionIds,
      isBestSeller: data.isBestSeller,
      isNew: data.isNew,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[680px] max-h-[90vh] overflow-y-auto p-0 gap-0 border-border">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary-dark shrink-0">
              <Package size={16} />
            </span>
            <div>
              <DialogTitle className="text-xl font-bold font-serif tracking-tight">
                {product ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Cập nhật thông tin chi tiết, hình ảnh bộ sưu tập và phân loại mẫu hoa.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(handleSubmitForm as SubmitHandler<ProductFormValues>)}
          className="p-6 space-y-6"
        >
          {/* Section 1: Thông tin cơ bản */}
          <div className="space-y-4 p-4 rounded-2xl bg-card/50 border border-border/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Tag size={13} className="text-primary" /> Thông tin cơ bản
            </h4>

            {/* Tên sản phẩm & Giá */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-semibold">
                  Tên sản phẩm *
                </Label>
                <Input
                  id="name"
                  {...form.register('name')}
                  placeholder="VD: Bó hoa hồng Sương Mai"
                  className="bg-background"
                />
                {form.formState.errors.name && (
                  <p className="text-[11px] text-destructive">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="price" className="text-xs font-semibold">
                    Giá bán (VNĐ) *
                  </Label>
                  {priceValue > 0 && (
                    <span className="text-[11px] font-mono text-primary-dark font-bold">
                      {formatCurrency(priceValue)}
                    </span>
                  )}
                </div>
                <Input
                  id="price"
                  type="number"
                  {...form.register('price')}
                  placeholder="450000"
                  className="bg-background font-mono tabular-nums"
                />
                {form.formState.errors.price && (
                  <p className="text-[11px] text-destructive">
                    {form.formState.errors.price.message}
                  </p>
                )}
              </div>
            </div>

            {/* Danh mục sản phẩm */}
            <div className="space-y-1.5">
              <Label htmlFor="category" className="text-xs font-semibold">
                Danh mục sản phẩm *
              </Label>
              <Select
                value={form.watch('category')}
                onValueChange={(val) => form.setValue('category', val as ProductCategory)}
              >
                <SelectTrigger id="category" className="bg-background">
                  <SelectValue placeholder="Chọn danh mục..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.length > 0 ? (
                    categories.map((c) => (
                      <SelectItem key={c.id} value={c.key || c.id}>
                        {c.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="bouquet">Hoa bó</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Section 2: Bộ sưu tập hình ảnh (Multi-Image Gallery) */}
          <div className="space-y-3 p-4 rounded-2xl bg-card/50 border border-border/80">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <ImageIcon size={13} className="text-primary" /> Bộ sưu tập hình ảnh sản phẩm (
                {imageList.length})
              </h4>
              {currentCoverUrl && (
                <span className="text-[11px] text-primary-dark font-medium flex items-center gap-1">
                  <Star size={11} className="fill-primary text-primary" /> Đã chọn ảnh đại diện
                </span>
              )}
            </div>

            {/* Upload Area & Gallery Grid */}
            <div className="space-y-3">
              {/* Image Grid Items */}
              {imageList.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 p-2 rounded-xl bg-background border border-border">
                  {imageList.map((imgUrl, idx) => {
                    const isCover = currentCoverUrl === imgUrl;
                    return (
                      <div
                        key={idx}
                        className={`relative aspect-[3/4] rounded-lg overflow-hidden border group transition-all bg-muted ${
                          isCover ? 'border-primary ring-2 ring-primary/40' : 'border-border'
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Product ${idx}`}
                          className="w-full h-full object-cover"
                        />

                        {/* Cover Badge */}
                        {isCover && (
                          <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-xs">
                            <Star size={9} className="fill-current" /> Ảnh chính
                          </span>
                        )}

                        {/* Action Overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                          {!isCover && (
                            <Button
                              type="button"
                              size="sm"
                              variant="secondary"
                              onClick={() => handleSetAsCover(imgUrl)}
                              className="h-6 text-[10px] px-2 rounded-md font-semibold bg-white/90 text-foreground hover:bg-primary hover:text-primary-foreground"
                            >
                              Đặt ảnh chính
                            </Button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="p-1 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/80 transition-colors"
                            title="Xóa ảnh"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Multi-File Upload Dropzone */}
              <label className="w-full h-24 rounded-xl border border-dashed border-input hover:border-primary/60 bg-background hover:bg-accent/40 flex flex-col items-center justify-center cursor-pointer text-muted-foreground hover:text-foreground transition-all">
                {uploading ? (
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <Loader2 className="animate-spin text-primary" size={16} /> Đang tải nhiều ảnh
                    lên hệ thống...
                  </div>
                ) : (
                  <>
                    <Upload size={20} className="mb-1 text-primary" />
                    <span className="text-xs font-semibold">
                      Tải lên một hoặc nhiều ảnh từ máy tính
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">
                      Giữ phím Shift/Ctrl để chọn nhiều tệp (JPG, PNG, WEBP)
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMultipleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>

              {/* Add Image by URL */}
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="Hoặc nhập URL hình ảnh mới..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddImageUrl();
                    }
                  }}
                  className="bg-background text-xs h-9"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddImageUrl}
                  className="h-9 text-xs shrink-0 rounded-lg px-3"
                >
                  <Plus size={14} className="mr-1" /> Thêm URL
                </Button>
              </div>

              {form.formState.errors.imageUrl && (
                <p className="text-[11px] text-destructive">
                  {form.formState.errors.imageUrl.message}
                </p>
              )}
            </div>
          </div>

          {/* Section 3: Thành phần hoa & Dịp tặng */}
          <div className="space-y-4 p-4 rounded-2xl bg-card/50 border border-border/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sparkles size={13} className="text-primary" /> Phân loại & Đặc tính
            </h4>

            {/* Thành phần hoa */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-semibold">Thành phần hoa chính</Label>
                <span className="text-[11px] text-muted-foreground font-medium">
                  Đã chọn:{' '}
                  <strong className="text-foreground">{selectedFlowerTypeIds.length}</strong>
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-background border border-border min-h-[52px]">
                {dbFlowerTypes.map((ft) => {
                  const isSelected =
                    selectedFlowerTypeIds.includes(ft.id) ||
                    selectedFlowerTypeIds.includes(ft.name);
                  return (
                    <button
                      key={ft.id}
                      type="button"
                      onClick={() => toggleFlowerType(ft.id)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer font-medium ${
                        isSelected
                          ? 'bg-primary text-primary-foreground border-primary font-semibold shadow-xs'
                          : 'bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground'
                      }`}
                    >
                      {isSelected ? <Check size={12} /> : null}
                      <span>{ft.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2 items-center">
                <Input
                  placeholder="Thêm thành phần hoa khác..."
                  value={customFlowerTypeInput}
                  onChange={(e) => setCustomFlowerTypeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomFlowerType();
                    }
                  }}
                  className="text-xs h-9 bg-background"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCustomFlowerType}
                  className="h-9 text-xs shrink-0 rounded-lg px-3"
                >
                  <Plus size={14} className="mr-1" /> Thêm
                </Button>
              </div>
            </div>

            {/* Dịp tặng phù hợp */}
            <div className="space-y-2 pt-2 border-t border-border/60">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-semibold">Dịp tặng phù hợp</Label>
                <span className="text-[11px] text-muted-foreground font-medium">
                  Đã chọn: <strong className="text-foreground">{selectedOccasionIds.length}</strong>
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-background border border-border min-h-[52px]">
                {dbOccasions.map((occ) => {
                  const isSelected =
                    selectedOccasionIds.includes(occ.id) || selectedOccasionIds.includes(occ.name);
                  return (
                    <button
                      key={occ.id}
                      type="button"
                      onClick={() => toggleOccasion(occ.id)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer font-medium ${
                        isSelected
                          ? 'bg-secondary text-secondary-foreground border-secondary font-semibold shadow-xs'
                          : 'bg-card text-muted-foreground hover:border-secondary/50 hover:text-foreground'
                      }`}
                    >
                      {isSelected ? <Check size={12} /> : null}
                      <span>{occ.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2 items-center">
                <Input
                  placeholder="Thêm dịp tặng khác..."
                  value={customOccasionInput}
                  onChange={(e) => setCustomOccasionInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomOccasion();
                    }
                  }}
                  className="text-xs h-9 bg-background"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCustomOccasion}
                  className="h-9 text-xs shrink-0 rounded-lg px-3"
                >
                  <Plus size={14} className="mr-1" /> Thêm
                </Button>
              </div>
            </div>
          </div>

          {/* Section 4: Mô tả & Trạng thái nổi bật */}
          <div className="space-y-4 p-4 rounded-2xl bg-card/50 border border-border/80">
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-semibold">
                Mô tả chi tiết sản phẩm
              </Label>
              <Textarea
                id="description"
                {...form.register('description')}
                placeholder="Mô tả phong cách cắm hoa, ý nghĩa hoặc thông điệp..."
                rows={3}
                className="bg-background text-xs resize-none"
              />
            </div>

            {/* Trạng thái Bán chạy & Mới */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background cursor-pointer hover:border-primary/50 transition-colors">
                <Checkbox
                  checked={form.watch('isBestSeller')}
                  onCheckedChange={(checked) => form.setValue('isBestSeller', !!checked)}
                />
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <Flame size={14} className="text-amber-500" />
                  <span>Sản phẩm Bán chạy</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background cursor-pointer hover:border-primary/50 transition-colors">
                <Checkbox
                  checked={form.watch('isNew')}
                  onCheckedChange={(checked) => form.setValue('isNew', !!checked)}
                />
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <Sparkles size={14} className="text-emerald-500" />
                  <span>Sản phẩm Mới</span>
                </div>
              </label>
            </div>
          </div>

          {/* Dialog Footer */}
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              disabled={isLoading || uploading}
              className="rounded-xl font-semibold px-5"
            >
              {isLoading && <Loader2 className="animate-spin mr-2" size={14} />}
              {product ? 'Lưu cập nhật' : 'Tạo sản phẩm mới'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
