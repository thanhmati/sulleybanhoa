import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '../ui/slider';
import { RotateCcw, Filter } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface ProductFiltersProps {
  filters: {
    priceRange: [number, number];
    flowerType: string[];
    occasion: string[];
  };
  setFilters: (filters: any) => void;
  maxPrice: number;
}

const FLOWER_TYPES = [
  'Rose',
  'Tulip',
  'Baby Breath',
  'Sunflower',
  'Peony',
  'Orchid',
  'Carnation',
  'Daisy',
  'Dried Flower',
];

const OCCASIONS = ['Birthday', 'Love', 'Anniversary', 'Opening', 'Graduation', 'Decoration'];

export default function ProductFilters({ filters, setFilters, maxPrice }: ProductFiltersProps) {
  const handleFlowerTypeChange = (type: string) => {
    const next = filters.flowerType.includes(type)
      ? filters.flowerType.filter((t) => t !== type)
      : [...filters.flowerType, type];
    setFilters({ ...filters, flowerType: next });
  };

  const handleOccasionChange = (occ: string) => {
    const next = filters.occasion.includes(occ)
      ? filters.occasion.filter((o) => o !== occ)
      : [...filters.occasion, occ];
    setFilters({ ...filters, occasion: next });
  };

  const handlePriceChange = (value: number[]) => {
    setFilters({ ...filters, priceRange: [value[0], value[1]] });
  };

  const resetFilters = () => {
    setFilters({
      ...filters,
      priceRange: [0, maxPrice],
      flowerType: [],
      occasion: [],
    });
  };

  return (
    <div className="p-1 rounded-[2.2rem] bg-white border border-border shadow-xl shadow-black/5">
      <div className="p-5 rounded-[calc(2.2rem-0.25rem)] bg-cream space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center text-primary-dark">
              <Filter size={16} />
            </span>
            <h3 className="font-serif text-lg font-bold tracking-tight text-foreground">Bộ Lọc</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-xs text-primary-dark hover:text-foreground hover:bg-primary/20 gap-1 h-8 px-3 rounded-full font-medium transition-all"
          >
            <RotateCcw size={12} />
            Đặt lại
          </Button>
        </div>

        <Accordion
          type="multiple"
          defaultValue={['price', 'type', 'occasion']}
          className="w-full space-y-3"
        >
          {/* Price Range */}
          <AccordionItem
            value="price"
            className="border border-border/80 bg-white/80 rounded-2xl px-4"
          >
            <AccordionTrigger className="hover:no-underline py-3.5 text-sm font-semibold text-foreground">
              Mức Giá
            </AccordionTrigger>
            <AccordionContent className="pt-0 pb-5 space-y-4">
              <Slider
                defaultValue={[0, maxPrice]}
                value={[filters.priceRange[0], filters.priceRange[1]]}
                max={maxPrice}
                step={50000}
                onValueChange={handlePriceChange}
                className="py-3"
              />
              <div className="flex items-center justify-between text-xs font-semibold text-foreground bg-cream p-2.5 rounded-xl border border-gray-100">
                <span>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                    maximumFractionDigits: 0,
                  }).format(filters.priceRange[0])}
                </span>
                <span className="text-gray-300">-</span>
                <span>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                    maximumFractionDigits: 0,
                  }).format(filters.priceRange[1])}
                </span>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Flower Type */}
          <AccordionItem
            value="type"
            className="border border-border/80 bg-white/80 rounded-2xl px-4"
          >
            <AccordionTrigger className="hover:no-underline py-3.5 text-sm font-semibold text-foreground">
              Loại Hoa
            </AccordionTrigger>
            <AccordionContent className="pt-0 pb-5">
              <div className="grid grid-cols-1 gap-2.5">
                {FLOWER_TYPES.map((type) => (
                  <div key={type} className="flex items-center space-x-3 group">
                    <Checkbox
                      id={`type-${type}`}
                      checked={filters.flowerType.includes(type)}
                      onCheckedChange={() => handleFlowerTypeChange(type)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary border-gray-300 rounded-md h-4 w-4 transition-all"
                    />
                    <Label
                      htmlFor={`type-${type}`}
                      className="text-xs font-medium cursor-pointer text-gray-600 group-hover:text-foreground transition-colors"
                    >
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Occasion */}
          <AccordionItem
            value="occasion"
            className="border border-border/80 bg-white/80 rounded-2xl px-4"
          >
            <AccordionTrigger className="hover:no-underline py-3.5 text-sm font-semibold text-foreground">
              Dịp Tặng
            </AccordionTrigger>
            <AccordionContent className="pt-0 pb-5">
              <div className="grid grid-cols-1 gap-2.5">
                {OCCASIONS.map((occ) => (
                  <div key={occ} className="flex items-center space-x-3 group">
                    <Checkbox
                      id={`occ-${occ}`}
                      checked={filters.occasion.includes(occ)}
                      onCheckedChange={() => handleOccasionChange(occ)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary border-gray-300 rounded-md h-4 w-4 transition-all"
                    />
                    <Label
                      htmlFor={`occ-${occ}`}
                      className="text-xs font-medium cursor-pointer text-gray-600 group-hover:text-foreground transition-colors"
                    >
                      {occ}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
