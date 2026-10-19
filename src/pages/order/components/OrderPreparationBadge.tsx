import { useUpdateOrderPreparationStatus } from '@/hooks/useOrders';
import { cn } from '@/lib/utils';
import { CheckCircle2, CircleDashed, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface OrderPreparationBadgeProps {
  id: string;
  isPrepared: boolean;
  size?: 'sm' | 'default';
  disabled?: boolean;
  className?: string;
}

export function OrderPreparationBadge({
  id,
  isPrepared,
  size = 'default',
  disabled = false,
  className,
}: OrderPreparationBadgeProps) {
  const updatePreparationStatus = useUpdateOrderPreparationStatus();

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || updatePreparationStatus.isPending) return;

    const nextStatus = !isPrepared;
    updatePreparationStatus.mutate(
      { id, isPrepared: nextStatus },
      {
        onSuccess: () => {
          if (nextStatus) {
            toast.success('Đã đánh dấu: Hoa đã chuẩn bị xong! 🌸');
          } else {
            toast.info('Đã chuyển về: Chưa chuẩn bị');
          }
        },
        onError: () => {
          toast.error('Không thể cập nhật trạng thái chuẩn bị');
        },
      },
    );
  };

  const isPending = updatePreparationStatus.isPending;

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={disabled || isPending}
      title={
        isPrepared
          ? 'Bấm để chuyển về trạng thái Chưa chuẩn bị'
          : 'Bấm để đánh dấu thợ đã cắm hoa xong'
      }
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border transition-all cursor-pointer select-none active:scale-95',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
        isPrepared
          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-300/70 dark:border-emerald-800/80 hover:bg-emerald-500/25'
          : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-300/70 dark:border-amber-800/80 hover:bg-amber-500/25',
        (disabled || isPending) && 'opacity-70 cursor-not-allowed',
        className,
      )}
    >
      {isPending ? (
        <Loader2 className={cn('animate-spin', size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5')} />
      ) : isPrepared ? (
        <CheckCircle2
          className={cn(
            'text-emerald-600 dark:text-emerald-400',
            size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5',
          )}
        />
      ) : (
        <CircleDashed
          className={cn(
            'text-amber-600 dark:text-amber-400',
            size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5',
          )}
        />
      )}
      <span>{isPrepared ? 'Đã cắm xong' : 'Chưa cắm'}</span>
    </button>
  );
}
