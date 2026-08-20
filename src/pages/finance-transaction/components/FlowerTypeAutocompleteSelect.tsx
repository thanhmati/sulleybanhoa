import { useState, useMemo } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IFlowerType } from '@/types/catalog-metadata';
import { Check, ChevronsUpDown, Search, Tag, X } from 'lucide-react';

interface FlowerTypeAutocompleteSelectProps {
  flowerTypes: IFlowerType[];
  selectedNames: string[];
  onSelectChange: (names: string[]) => void;
}

export function FlowerTypeAutocompleteSelect({
  flowerTypes,
  selectedNames,
  onSelectChange,
}: FlowerTypeAutocompleteSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Sort flower types alphabetically (Vietnamese locale)
  const sortedFlowerTypes = useMemo(() => {
    return [...flowerTypes].sort((a, b) => a.name.localeCompare(b.name, 'vi'));
  }, [flowerTypes]);

  // 2. Filter list based on search query
  const filteredFlowerTypes = useMemo(() => {
    if (!searchQuery.trim()) return sortedFlowerTypes;
    const query = searchQuery.toLowerCase().trim();
    return sortedFlowerTypes.filter((ft) => ft.name.toLowerCase().includes(query));
  }, [sortedFlowerTypes, searchQuery]);

  const toggleFlower = (name: string) => {
    if (selectedNames.includes(name)) {
      onSelectChange(selectedNames.filter((n) => n !== name));
    } else {
      onSelectChange([...selectedNames, name]);
    }
  };

  const removeFlower = (name: string) => {
    onSelectChange(selectedNames.filter((n) => n !== name));
  };

  const clearAll = () => {
    onSelectChange([]);
  };

  const selectAllFiltered = () => {
    const filteredNames = filteredFlowerTypes.map((ft) => ft.name);
    const combined = Array.from(new Set([...selectedNames, ...filteredNames]));
    onSelectChange(combined);
  };

  const areAllFilteredSelected =
    filteredFlowerTypes.length > 0 &&
    filteredFlowerTypes.every((ft) => selectedNames.includes(ft.name));

  return (
    <div className="space-y-2 p-3.5 rounded-xl bg-card border border-border/80 shadow-xs">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <Tag size={14} className="text-primary" /> Chọn các loại hoa nhập vào
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground font-medium">
            Đã chọn: <strong className="text-foreground">{selectedNames.length}</strong>
          </span>
          {selectedNames.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="text-[11px] text-destructive hover:underline cursor-pointer font-medium"
            >
              Bỏ chọn tất cả
            </button>
          )}
        </div>
      </div>

      {/* Autocomplete Dropdown Trigger */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-background border-border text-xs h-10 font-normal hover:bg-accent/50"
          >
            <span className="truncate text-muted-foreground">
              {selectedNames.length > 0
                ? `Đã chọn ${selectedNames.length} loại hoa`
                : 'Tìm kiếm hoặc chọn loại hoa...'}
            </span>
            <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-2"
          align="start"
          onWheel={(e) => e.stopPropagation()}
        >
          {/* Search Input Header */}
          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Nhập tên loại hoa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-7 text-xs h-8"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Action Header inside Dropdown */}
          <div className="flex justify-between items-center px-2 py-1 mb-1 border-b border-border text-[11px] text-muted-foreground">
            <span>Tìm thấy {filteredFlowerTypes.length} loại hoa</span>
            {filteredFlowerTypes.length > 0 && (
              <button
                type="button"
                onClick={selectAllFiltered}
                disabled={areAllFilteredSelected}
                className="text-primary hover:underline disabled:opacity-40 font-medium cursor-pointer"
              >
                {areAllFilteredSelected ? 'Đã chọn tất cả' : 'Chọn tất cả'}
              </button>
            )}
          </div>

          {/* Sorted Flower List using ScrollArea with stopped wheel propagation & overscroll contain */}
          <ScrollArea
            className="h-56 pr-1.5 overscroll-contain"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <div className="space-y-0.5">
              {filteredFlowerTypes.length > 0 ? (
                filteredFlowerTypes.map((ft) => {
                  const isSelected = selectedNames.includes(ft.name);
                  return (
                    <div
                      key={ft.id}
                      onClick={() => toggleFlower(ft.name)}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'hover:bg-accent text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleFlower(ft.name)}
                          tabIndex={-1}
                        />
                        <span>{ft.name}</span>
                      </div>
                      {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
                    </div>
                  );
                })
              ) : (
                <div className="p-3 text-center text-xs text-muted-foreground">
                  Không tìm thấy loại hoa phù hợp
                </div>
              )}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>

      {/* Selected Flowers Badge List */}
      {selectedNames.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1.5 max-h-32 overflow-y-auto">
          {selectedNames.map((name) => (
            <Badge
              key={name}
              variant="secondary"
              className="text-[11px] py-0.5 px-2 bg-primary/15 text-primary border border-primary/20 flex items-center gap-1 font-medium"
            >
              {name}
              <button
                type="button"
                onClick={() => removeFlower(name)}
                className="hover:text-destructive focus:outline-none cursor-pointer rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
