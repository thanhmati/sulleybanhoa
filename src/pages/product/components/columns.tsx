import { ColumnDef } from '@tanstack/react-table';
import { Product } from '@/types/product';
import { formatCurrency } from '@/lib/utils/formatters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface ProductColumnsProps {
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onToggleBestSeller: (product: Product, value: boolean) => void;
  onToggleNew: (product: Product, value: boolean) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  bouquet: 'Hoa bó',
  basket: 'Giỏ hoa',
  box: 'Hộp hoa',
  plant: 'Cây & Lan',
  stand: 'Kệ hoa',
};

export const getProductColumns = ({
  onEdit,
  onDelete,
  onToggleBestSeller,
  onToggleNew,
}: ProductColumnsProps): ColumnDef<Product>[] => [
  {
    accessorKey: 'imageUrl',
    header: 'Hình ảnh',
    cell: ({ row }) => (
      <div className="w-10 h-12 rounded overflow-hidden bg-muted border border-border shrink-0">
        <img
          src={row.original.imageUrl}
          alt={row.original.name}
          className="w-full h-full object-cover"
        />
      </div>
    ),
  },
  {
    accessorKey: 'name',
    header: 'Tên sản phẩm',
    cell: ({ row }) => (
      <div>
        <div className="font-medium text-foreground text-sm">{row.original.name}</div>
        {row.original.flowerType && row.original.flowerType.length > 0 && (
          <div className="text-xs text-muted-foreground mt-0.5">
            {row.original.flowerType.join(', ')}
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'price',
    header: 'Giá bán',
    cell: ({ row }) => (
      <span className="font-semibold text-xs tabular-nums text-foreground">
        {formatCurrency(row.original.price)}
      </span>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Danh mục',
    cell: ({ row }) => (
      <Badge variant="secondary" className="text-xs">
        {CATEGORY_LABELS[row.original.category] || row.original.category}
      </Badge>
    ),
  },
  {
    accessorKey: 'isBestSeller',
    header: 'Bán chạy',
    cell: ({ row }) => (
      <Checkbox
        checked={row.original.isBestSeller}
        onCheckedChange={(checked) => onToggleBestSeller(row.original, !!checked)}
      />
    ),
  },
  {
    accessorKey: 'isNew',
    header: 'Mới',
    cell: ({ row }) => (
      <Checkbox
        checked={row.original.isNew}
        onCheckedChange={(checked) => onToggleNew(row.original, !!checked)}
      />
    ),
  },
  {
    id: 'actions',
    header: 'Thao tác',
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(row.original)}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <Edit2 size={14} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(row.original)}
          className="h-8 w-8 text-destructive hover:text-destructive"
        >
          <Trash2 size={14} />
        </Button>
      </div>
    ),
  },
];
