import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FileText, MessageSquareText } from 'lucide-react';

interface OrderNoteCellProps {
  note?: string;
}

export function OrderNoteCell({ note }: OrderNoteCellProps) {
  const trimmedNote = note?.trim();

  if (!trimmedNote) {
    return <span className="text-muted-foreground/30 text-xs text-center block">-</span>;
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-xs font-medium cursor-pointer hover:bg-amber-500/20 transition-colors max-w-[150px]">
            <FileText className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
            <span className="truncate">{trimmedNote}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-xs p-3 space-y-1.5 shadow-lg border border-border"
        >
          <div className="font-semibold text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5 border-b border-border/50 pb-1">
            <MessageSquareText className="h-3.5 w-3.5" /> Ghi chú đơn hàng
          </div>
          <p className="text-xs text-popover-foreground whitespace-pre-wrap leading-relaxed">
            {trimmedNote}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
