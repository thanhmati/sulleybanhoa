import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Eye, ArrowUpRight, Sparkles } from 'lucide-react';
import { Product } from '@/types/product';
import { formatCurrency } from '@/lib/utils/formatters';
import { useFlowerTypesQuery } from '@/hooks/useFlowerTypes';
import { useOccasionsQuery } from '@/hooks/useOccasions';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { data: dbFlowerTypes = [] } = useFlowerTypesQuery();
  const { data: dbOccasions = [] } = useOccasionsQuery();

  // Map flowerType UUIDs or Names to human readable names
  const flowerTypeNames = (product.flowerType || [])
    .map((val) => dbFlowerTypes.find((ft) => ft.id === val || ft.name === val)?.name || val)
    .filter(Boolean);

  // Map occasion UUIDs or Names to human readable names
  const occasionNames = (product.occasion || [])
    .map((val) => dbOccasions.find((occ) => occ.id === val || occ.name === val)?.name || val)
    .filter(Boolean);

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-[2rem] bg-white border border-border/80 hover:border-primary shadow-xs hover:shadow-xl hover:shadow-primary/20 transition-all duration-500 h-full flex flex-col justify-between overflow-hidden p-2"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] rounded-[calc(2rem-0.5rem)] overflow-hidden bg-cream mb-3">
        {/* Floating Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          {product.isBestSeller && (
            <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider text-charcoal shadow-sm border border-white/60 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-primary-dark" />
              Bán chạy
            </div>
          )}
          {product.isNew && (
            <div className="bg-primary text-charcoal px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-xs">
              Mới
            </div>
          )}
        </div>

        {/* Quick View Button on Hover */}
        {onQuickView && (
          <div
            className={`absolute inset-x-0 bottom-3 z-20 px-4 flex justify-center transition-all duration-300 ${
              isHovered
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-3 pointer-events-none'
            }`}
          >
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="w-full rounded-full bg-white/90 backdrop-blur-md text-charcoal hover:bg-primary hover:text-charcoal border border-white/80 shadow-lg text-xs font-semibold h-9 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              Xem nhanh
            </Button>
          </div>
        )}

        {/* Main Product Image */}
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-108"
          />
        </Link>
      </div>

      {/* Product Content Details */}
      <CardContent className="px-3 pb-3 pt-1 space-y-2 flex-1 flex flex-col justify-between">
        <div>
          {/* Flower Type & Occasion Tags */}
          <div className="space-y-1 mb-2">
            {flowerTypeNames.length > 0 && (
              <div className="text-[11px] font-medium text-primary-dark tracking-wide flex items-center gap-1 line-clamp-1">
                <span className="font-semibold text-gray-500">Loại hoa:</span>
                <span>{flowerTypeNames.join(', ')}</span>
              </div>
            )}
            {occasionNames.length > 0 && (
              <div className="text-[11px] font-medium text-secondary-dark tracking-wide flex items-center gap-1 line-clamp-1">
                <span className="font-semibold text-gray-500">Dịp thích hợp:</span>
                <span>{occasionNames.join(', ')}</span>
              </div>
            )}
          </div>

          {/* Product Name & Price Header */}
          <div className="flex justify-between items-start gap-2">
            <Link
              to={`/product/${product.id}`}
              className="group-hover:text-primary-dark transition-colors"
            >
              <h3 className="text-base font-serif font-bold text-foreground leading-snug line-clamp-1">
                {product.name}
              </h3>
            </Link>
            <span className="font-semibold text-xs text-charcoal bg-primary/30 px-2.5 py-1 rounded-full shrink-0 tabular-nums">
              {formatCurrency(product.price)}
            </span>
          </div>

          {/* Short Description */}
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mt-1.5 font-normal">
            {product.description}
          </p>
        </div>

        {/* Card Footer */}
        <div className="flex justify-between items-center pt-2.5 border-t border-gray-100">
          <div className="flex items-center gap-1 text-primary-dark">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={11} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <span className="text-[11px] text-gray-400 font-medium ml-1">5.0</span>
          </div>

          <Link
            to={`/product/${product.id}`}
            className="text-xs font-semibold text-primary-dark group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5"
          >
            Chi tiết <ArrowUpRight size={13} />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
