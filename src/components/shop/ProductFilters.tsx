import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '../ui/slider'; // Use relative path as previously fixed
import { RotateCcw } from 'lucide-react';
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
  // Handlers
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
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="font-serif text-xl font-bold tracking-tight">Bộ lọc</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="text-gray-400 hover:text-black hover:bg-transparent gap-1 h-auto p-0 font-normal transition-colors"
        >
          <RotateCcw size={14} />
          Đặt lại
        </Button>
      </div>

      <Accordion
        type="multiple"
        defaultValue={['price', 'type', 'occasion']}
        className="w-full space-y-4"
      >
        {/* Price Range */}
        <AccordionItem value="price" className="border-none bg-gray-50/50 rounded-xl px-4">
          <AccordionTrigger className="hover:no-underline py-4 text-base font-semibold text-gray-900 group">
            Mức giá
          </AccordionTrigger>
          <AccordionContent className="pt-0 pb-6">
            <Slider
              defaultValue={[0, maxPrice]}
              value={[filters.priceRange[0], filters.priceRange[1]]}
              max={maxPrice}
              step={50000}
              onValueChange={handlePriceChange}
              className="py-4"
            />
            <div className="flex items-center justify-between text-sm font-medium text-gray-900 mt-2">
              <span>
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                  maximumFractionDigits: 0,
                }).format(filters.priceRange[0])}
              </span>
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
        <AccordionItem value="type" className="border-none bg-gray-50/50 rounded-xl px-4">
          <AccordionTrigger className="hover:no-underline py-4 text-base font-semibold text-gray-900">
            Loại hoa
          </AccordionTrigger>
          <AccordionContent className="pt-0 pb-6">
            <div className="grid grid-cols-1 gap-3">
              {FLOWER_TYPES.map((type) => (
                <div key={type} className="flex items-center space-x-3 group">
                  <Checkbox
                    id={`type-${type}`}
                    checked={filters.flowerType.includes(type)}
                    onCheckedChange={() => handleFlowerTypeChange(type)}
                    className="data-[state=checked]:bg-black data-[state=checked]:border-black border-gray-300 rounded-md h-5 w-5 transition-all duration-200"
                  />
                  <Label
                    htmlFor={`type-${type}`}
                    className="text-[15px] font-normal cursor-pointer text-gray-600 group-hover:text-black transition-colors"
                  >
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Occasion */}
        <AccordionItem value="occasion" className="border-none bg-gray-50/50 rounded-xl px-4">
          <AccordionTrigger className="hover:no-underline py-4 text-base font-semibold text-gray-900">
            Dịp
          </AccordionTrigger>
          <AccordionContent className="pt-0 pb-6">
            <div className="grid grid-cols-1 gap-3">
              {OCCASIONS.map((occ) => (
                <div key={occ} className="flex items-center space-x-3 group">
                  <Checkbox
                    id={`occ-${occ}`}
                    checked={filters.occasion.includes(occ)}
                    onCheckedChange={() => handleOccasionChange(occ)}
                    className="data-[state=checked]:bg-black data-[state=checked]:border-black border-gray-300 rounded-md h-5 w-5 transition-all duration-200"
                  />
                  <Label
                    htmlFor={`occ-${occ}`}
                    className="text-[15px] font-normal cursor-pointer text-gray-600 group-hover:text-black transition-colors"
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
  );
}
