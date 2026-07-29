import { Button } from '@/components/ui/button';
import { Slider } from '../ui/slider';
import { RotateCcw, Filter, Check, Tag } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { formatCurrency } from '@/lib/utils/formatters';

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

const PRICE_PRESETS: { label: string; range: [number, number] }[] = [
  { label: '< 500k', range: [0, 500000] },
  { label: '500k - 1.5M', range: [500000, 1500000] },
  { label: '1.5M - 3M', range: [1500000, 3000000] },
  { label: '> 3M', range: [3000000, 5000000] },
];

export default function ProductFilters({ filters, setFilters, maxPrice }: ProductFiltersProps) {
  const handleFlowerTypeToggle = (type: string) => {
    const next = filters.flowerType.includes(type)
      ? filters.flowerType.filter((t) => t !== type)
      : [...filters.flowerType, type];
    setFilters({ ...filters, flowerType: next });
  };

  const handleOccasionToggle = (occ: string) => {
    const next = filters.occasion.includes(occ)
      ? filters.occasion.filter((o) => o !== occ)
      : [...filters.occasion, occ];
    setFilters({ ...filters, occasion: next });
  };

  const handlePriceChange = (value: number[]) => {
    setFilters({ ...filters, priceRange: [value[0], value[1]] });
  };

  const applyPricePreset = (range: [number, number]) => {
    setFilters({ ...filters, priceRange: range });
  };

  const resetFilters = () => {
    setFilters({
      ...filters,
      priceRange: [0, maxPrice],
      flowerType: [],
      occasion: [],
    });
  };

  // Calculate active filter count
  const activeCount =
    (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice ? 1 : 0) +
    filters.flowerType.length +
    filters.occasion.length;

  return (
    <div className="p-1 rounded-[2.2rem] bg-white border border-border shadow-xl shadow-black/5">
      <div className="p-5 rounded-[calc(2.2rem-0.25rem)] bg-cream space-y-6">
        {/* Filter Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center text-primary-dark shadow-xs">
              <Filter size={15} />
            </span>
            <div>
              <h3 className="font-serif text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                Bộ Lọc
                {activeCount > 0 && (
                  <span className="text-[11px] font-sans font-bold bg-primary text-charcoal px-2 py-0.5 rounded-full">
                    {activeCount}
                  </span>
                )}
              </h3>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            disabled={activeCount === 0}
            className="text-xs text-primary-dark hover:text-foreground hover:bg-primary/20 gap-1 h-8 px-3 rounded-full font-medium transition-all disabled:opacity-40"
          >
            <RotateCcw size={12} />
            Đặt lại
          </Button>
        </div>

        {/* Filter Sections */}
        <Accordion
          type="multiple"
          defaultValue={['price', 'type', 'occasion']}
          className="w-full space-y-3"
        >
          {/* Price Range Section */}
          <AccordionItem
            value="price"
            className="border border-border/80 bg-white/90 rounded-2xl px-4 overflow-hidden"
          >
            <AccordionTrigger className="hover:no-underline py-3.5 text-sm font-semibold text-foreground">
              Khoảng Giá
            </AccordionTrigger>
            <AccordionContent className="pt-0 pb-5 space-y-4">
              {/* Quick Presets */}
              <div className="grid grid-cols-2 gap-1.5">
                {PRICE_PRESETS.map((preset) => {
                  const isActive =
                    filters.priceRange[0] === preset.range[0] &&
                    filters.priceRange[1] === preset.range[1];
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => applyPricePreset(preset.range)}
                      className={`text-xs px-2.5 py-1.5 rounded-xl border transition-all font-medium text-center cursor-pointer ${
                        isActive
                          ? 'bg-primary text-charcoal border-primary-dark font-bold shadow-xs'
                          : 'bg-cream text-gray-600 border-gray-100 hover:border-primary/50 hover:bg-white'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>

              {/* Slider */}
              <div className="pt-2">
                <Slider
                  defaultValue={[0, maxPrice]}
                  value={[filters.priceRange[0], filters.priceRange[1]]}
                  max={maxPrice}
                  step={50000}
                  onValueChange={handlePriceChange}
                  className="py-2"
                />
              </div>

              {/* Price Range Display */}
              <div className="flex items-center justify-between text-xs font-semibold text-foreground bg-cream p-2.5 rounded-xl border border-gray-100 tabular-nums">
                <span>{formatCurrency(filters.priceRange[0])}</span>
                <span className="text-gray-300">-</span>
                <span>{formatCurrency(filters.priceRange[1])}</span>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Flower Type Chips */}
          <AccordionItem
            value="type"
            className="border border-border/80 bg-white/90 rounded-2xl px-4 overflow-hidden"
          >
            <AccordionTrigger className="hover:no-underline py-3.5 text-sm font-semibold text-foreground">
              Loại Hoa
            </AccordionTrigger>
            <AccordionContent className="pt-0 pb-5">
              <div className="flex flex-wrap gap-1.5">
                {FLOWER_TYPES.map((type) => {
                  const isSelected = filters.flowerType.includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleFlowerTypeToggle(type)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1 cursor-pointer font-medium ${
                        isSelected
                          ? 'bg-primary text-charcoal border-primary-dark font-bold shadow-xs'
                          : 'bg-cream text-gray-600 border-gray-100 hover:border-primary/50 hover:bg-white'
                      }`}
                    >
                      {isSelected && <Check size={11} />}
                      {type}
                    </button>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Occasions Chips */}
          <AccordionItem
            value="occasion"
            className="border border-border/80 bg-white/90 rounded-2xl px-4 overflow-hidden"
          >
            <AccordionTrigger className="hover:no-underline py-3.5 text-sm font-semibold text-foreground">
              Dịp Tặng
            </AccordionTrigger>
            <AccordionContent className="pt-0 pb-5">
              <div className="flex flex-wrap gap-1.5">
                {OCCASIONS.map((occ) => {
                  const isSelected = filters.occasion.includes(occ);
                  return (
                    <button
                      key={occ}
                      type="button"
                      onClick={() => handleOccasionToggle(occ)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1 cursor-pointer font-medium ${
                        isSelected
                          ? 'bg-secondary text-charcoal border-secondary-dark font-bold shadow-xs'
                          : 'bg-cream text-gray-600 border-gray-100 hover:border-secondary/50 hover:bg-white'
                      }`}
                    >
                      {isSelected ? (
                        <Check size={11} />
                      ) : (
                        <Tag size={10} className="text-gray-400" />
                      )}
                      {occ}
                    </button>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
