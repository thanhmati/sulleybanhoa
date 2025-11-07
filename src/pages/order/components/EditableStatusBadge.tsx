import { useState, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  ORDER_STATUS,
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABEL,
} from '@/lib/constants/order.constant';
import { useUpdateOrderStatus } from '@/hooks/useOrders';
import { toast } from 'sonner';

interface EditableStatusBadgeProps {
  status: ORDER_STATUS;
  id: string;
}

export function EditableStatusBadge({ id, status }: EditableStatusBadgeProps) {
  const [editing, setEditing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const updateOrderStatus = useUpdateOrderStatus();

  const onChange = (value: ORDER_STATUS) => {
    updateOrderStatus.mutate(
      { id, status: value },
      {
        onSuccess: () => {
          toast.success('Cập nhật trạng thái thành công!');
        },
        onError: () => toast.error('Cập nhật thất bại'),
      },
    );
  };

  if (editing) {
    return (
      <div ref={ref}>
        <Select
          value={status}
          onValueChange={(value) => {
            onChange(value as ORDER_STATUS);
            setEditing(false);
          }}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setEditing(false);
            }
          }}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(ORDER_STATUS).map((s) => (
              <SelectItem key={s} value={s}>
                {ORDER_STATUS_LABEL[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <Badge
      style={{ backgroundColor: ORDER_STATUS_COLORS[status], color: 'white', cursor: 'pointer' }}
      onClick={() => setEditing(true)}
    >
      {ORDER_STATUS_LABEL[status]}
    </Badge>
  );
}
