import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingBag, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Product } from '@/types/product';
import { formatCurrency } from '@/lib/utils/formatters';
import { useFlowerTypesQuery } from '@/hooks/useFlowerTypes';
import { useOccasionsQuery } from '@/hooks/useOccasions';

interface ProductQuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductQuickViewModal({ product, isOpen, onClose }: ProductQuickViewModalProps) {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const { data: dbFlowerTypes = [] } = useFlowerTypesQuery();
  const { data: dbOccasions = [] } = useOccasionsQuery();

  useEffect(() => {
    if (product) {
      const images =
        product.images && product.images.length > 0 ? product.images : [product.imageUrl];
      setSelectedImage(images[0] || product.imageUrl);
    }
  }, [product]);

  if (!product) return null;

  const images = product.images && product.images.length > 0 ? product.images : [product.imageUrl];
  const activeImage = selectedImage || product.imageUrl;

  // Map flowerType UUIDs or Names to human readable names
  const flowerTypeNames = (product.flowerType || []).map(
    (val) => dbFlowerTypes.find((ft) => ft.id === val || ft.name === val)?.name || val,
  );

  // Map occasion UUIDs or Names to human readable names
  const occasionNames = (product.occasion || []).map(
    (val) => dbOccasions.find((occ) => occ.id === val || occ.name === val)?.name || val,
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-[2.5rem] bg-white border border-border sm:max-w-2xl md:max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image Gallery Preview */}
          <div className="bg-cream p-6 flex flex-col justify-between items-center relative">
            {/* Main Active Image */}
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-xs bg-white mb-3">
              <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 flex gap-1.5">
                {product.isBestSeller && (
                  <span className="bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-charcoal border border-white/60 flex items-center gap-1">
                    <Sparkles size={10} className="text-primary-dark" /> Bán chạy
                  </span>
                )}
                {product.isNew && (
                  <span className="bg-primary text-charcoal px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    Mới
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="flex gap-2 justify-center w-full">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImage === img
                        ? 'border-primary ring-2 ring-primary/30 scale-105'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Actions */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div>
              <DialogHeader className="p-0 text-left space-y-2">
                <div className="flex items-center gap-2">
                  <span className="eyebrow-tag text-[10px] px-2.5 py-0.5">Hàn Quốc Premium</span>
                  <div className="flex items-center gap-1 text-primary-dark text-xs font-semibold">
                    <Star size={12} fill="currentColor" /> 5.0 (Đánh giá cao)
                  </div>
                </div>
                <DialogTitle className="font-serif text-2xl md:text-3xl text-foreground font-bold">
                  {product.name}
                </DialogTitle>
              </DialogHeader>

              {/* Price */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-2xl font-bold text-primary-dark font-serif tracking-tight tabular-nums">
                  {formatCurrency(product.price)}
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  Đã bao gồm VAT & Giấy gói cao cấp
                </span>
              </div>

              {/* Description */}
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">{product.description}</p>

              {/* Flower Attributes */}
              <div className="mt-5 space-y-3 pt-4 border-t border-gray-100">
                {flowerTypeNames.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-400 w-24 shrink-0">
                      Loại hoa:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {flowerTypeNames.map((t, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="rounded-full bg-cream text-charcoal font-medium text-[11px] border border-border"
                        >
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {occasionNames.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-400 w-24 shrink-0">
                      Dịp thích hợp:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {occasionNames.map((o, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="rounded-full border-primary/40 text-primary-dark font-medium text-[11px]"
                        >
                          {o}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-secondary-dark font-medium pt-1">
                  <CheckCircle2 size={14} /> Hoa tươi 100% nhập mới trong ngày • Giao hoa nhanh 2H
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <Link to={`/product/${product.id}`} onClick={onClose} className="block w-full">
                <Button className="w-full rounded-full bg-primary hover:bg-primary-dark text-charcoal hover:text-white font-semibold h-11 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2">
                  <ShoppingBag size={16} />
                  Xem chi tiết & Đặt hoa
                  <ArrowRight size={15} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
