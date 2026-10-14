import { useState, useRef, useEffect } from 'react';
import { Search, Plus, X, Flower2, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFlowerTypesQuery, useCreateFlowerTypeMutation } from '@/hooks/useFlowerTypes';

interface OrderFlowerPickerProps {
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
}

export function OrderFlowerPicker({
  value = [],
  onChange,
  label = 'Các loại hoa sử dụng cho đơn hàng',
}: OrderFlowerPickerProps) {
  const [search, setSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: dbFlowerTypes = [], isLoading } = useFlowerTypesQuery();
  const createFlowerType = useCreateFlowerTypeMutation();

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedList = value || [];

  // Tìm kiếm theo từ khóa
  const filteredOptions = dbFlowerTypes.filter(
    (ft) =>
      ft.name.toLowerCase().includes(search.toLowerCase().trim()) &&
      !selectedList.includes(ft.name) &&
      !selectedList.includes(ft.id),
  );

  const handleToggle = (item: string) => {
    if (selectedList.includes(item)) {
      onChange(selectedList.filter((f) => f !== item));
    } else {
      onChange([...selectedList, item]);
    }
  };

  const handleRemove = (item: string) => {
    onChange(selectedList.filter((f) => f !== item));
  };

  const handleAddCustom = async () => {
    const trimmed = search.trim();
    if (!trimmed) return;

    // Kiểm tra xem tên này đã tồn tại trong dbFlowerTypes chưa
    const existing = dbFlowerTypes.find((ft) => ft.name.toLowerCase() === trimmed.toLowerCase());

    if (existing) {
      if (!selectedList.includes(existing.name)) {
        onChange([...selectedList, existing.name]);
      }
    } else {
      // Tạo mới vào flower_types với leadDays = 0 mặc định
      try {
        const created = await createFlowerType.mutateAsync({
          name: trimmed,
          description: '',
          leadDays: 0,
        });
        onChange([...selectedList, created.name]);
      } catch {
        // Fallback lưu tên
        onChange([...selectedList, trimmed]);
      }
    }
    setSearch('');
    setIsDropdownOpen(false);
  };

  // Helper tìm thông tin hoa
  const getFlowerInfo = (val: string) => {
    const found = dbFlowerTypes.find((ft) => ft.id === val || ft.name === val);
    return {
      displayName: found ? found.name : val,
      leadDays: found?.leadDays ?? 0,
    };
  };

  return (
    <div className="space-y-2.5" ref={containerRef}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
          <Flower2 size={15} className="text-primary" />
          {label}
        </label>
        {selectedList.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-[11px] text-destructive hover:underline font-medium cursor-pointer"
          >
            Xoá tất cả ({selectedList.length})
          </button>
        )}
      </div>

      {/* Hiển thị các loại hoa đã chọn */}
      {selectedList.length > 0 ? (
        <div className="flex flex-wrap gap-2 p-2.5 rounded-xl bg-muted/40 border border-border min-h-[44px] items-center">
          {selectedList.map((val) => {
            const info = getFlowerInfo(val);
            return (
              <span
                key={val}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/15 text-primary-dark border border-primary/30 shadow-2xs transition-all animate-in fade-in zoom-in-95"
              >
                <span>{info.displayName}</span>
                {info.leadDays > 0 && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-medium bg-amber-200/70 text-amber-900 dark:bg-amber-950 dark:text-amber-200 px-1.5 py-0.2 rounded-md">
                    <Clock size={10} />
                    {info.leadDays}d
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(val)}
                  className="hover:text-destructive hover:bg-destructive/10 rounded-full p-0.5 transition-colors cursor-pointer"
                  title="Xoá hoa này"
                >
                  <X size={13} />
                </button>
              </span>
            );
          })}
        </div>
      ) : (
        <div className="text-xs text-muted-foreground italic px-2 py-1">
          Chưa chọn loại hoa nào cho đơn hàng này.
        </div>
      )}

      {/* Ô tìm kiếm & Chọn loại hoa */}
      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (filteredOptions.length > 0) {
                    handleToggle(filteredOptions[0].name);
                    setSearch('');
                  } else if (search.trim()) {
                    handleAddCustom();
                  }
                }
              }}
              placeholder="Gõ để tìm kiếm hoa (VD: Hoa Hồng, Hoa Ly, Baby...) hoặc thêm mới..."
              className="pl-9 h-9 text-xs bg-background"
            />
          </div>

          {search.trim() && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddCustom}
              disabled={createFlowerType.isPending}
              className="h-9 text-xs shrink-0 cursor-pointer"
            >
              <Plus size={14} className="mr-1" />
              Thêm "{search.trim()}"
            </Button>
          )}
        </div>

        {/* Dropdown danh sách gợi ý */}
        {isDropdownOpen && (
          <div className="absolute z-50 left-0 right-0 mt-1 max-h-56 overflow-y-auto rounded-xl border bg-popover p-1.5 shadow-lg text-popover-foreground">
            {isLoading ? (
              <div className="p-3 text-xs text-center text-muted-foreground">
                Đang tải danh sách hoa...
              </div>
            ) : filteredOptions.length > 0 ? (
              <div className="space-y-0.5">
                <div className="px-2 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Chọn loại hoa từ danh mục
                </div>
                {filteredOptions.map((ft) => (
                  <button
                    key={ft.id}
                    type="button"
                    onClick={() => {
                      handleToggle(ft.name);
                      setSearch('');
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-accent hover:text-accent-foreground flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span className="font-medium text-foreground">{ft.name}</span>
                    <div className="flex items-center gap-2">
                      {ft.leadDays !== undefined && ft.leadDays > 0 ? (
                        <span className="text-[10px] text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.5 rounded-md flex items-center gap-1 font-medium">
                          <Clock size={10} /> Nhập trước {ft.leadDays} ngày
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground">Trong ngày</span>
                      )}
                      <Plus size={12} className="text-muted-foreground" />
                    </div>
                  </button>
                ))}
              </div>
            ) : search.trim() ? (
              <div className="p-3 text-center">
                <p className="text-xs text-muted-foreground mb-2">
                  Chưa có hoa "{search.trim()}" trong danh mục.
                </p>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddCustom}
                  disabled={createFlowerType.isPending}
                  className="h-7 text-xs cursor-pointer"
                >
                  <Plus size={12} className="mr-1" />
                  Tạo mới và chọn "{search.trim()}"
                </Button>
              </div>
            ) : (
              <div className="p-3 text-xs text-center text-muted-foreground">
                Tất cả hoa đã được chọn hoặc không có hoa phù hợp.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
