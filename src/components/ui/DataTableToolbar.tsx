import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useDataTable } from './DataTableProvider';
import { Settings2Icon, Eye, RotateCcw } from 'lucide-react';

interface DataTableToolbarProps {
  filters?: React.ReactNode; // Filter/search area (bên trái)
  actions?: React.ReactNode; // Action buttons (bên phải)
  showColumnVisibility?: boolean; // Toggle show/hide "Columns" dropdown
}

export function DataTableToolbar({
  filters,
  actions,
  showColumnVisibility = true,
}: DataTableToolbarProps) {
  const table = useDataTable();

  const hideableColumns = table
    .getAllColumns()
    .filter((column) => column.getCanHide() && column.columnDef.header?.toString());

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full">
      {/* LEFT: Filters */}
      <div className="flex items-center gap-2 sm:justify-start w-full sm:w-auto">{filters}</div>

      {/* RIGHT: Column visibility + Actions */}
      <div className="flex items-center gap-2 sm:justify-end w-full sm:w-auto">
        {showColumnVisibility && hideableColumns.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5 cursor-pointer"
              >
                <Settings2Icon className="h-4 w-4" />
                <span>Hiển thị cột</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
                Tuỳ chỉnh hiển thị cột
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-64 overflow-y-auto space-y-0.5">
                {hideableColumns.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize cursor-pointer text-xs"
                    checked={column.getIsVisible()}
                    onSelect={(e) => e.preventDefault()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {typeof column.columnDef.header === 'string'
                      ? column.columnDef.header
                      : column.id}
                  </DropdownMenuCheckboxItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <div className="flex items-center gap-1.5 p-1 pt-1.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs flex-1 cursor-pointer justify-center px-2 font-normal"
                  onClick={() => table.toggleAllColumnsVisible(true)}
                  title="Hiện tất cả các cột"
                >
                  <Eye className="h-3.5 w-3.5 mr-1 shrink-0" />
                  <span className="whitespace-nowrap">Hiện tất cả</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs flex-1 cursor-pointer justify-center px-2 font-normal text-muted-foreground hover:text-foreground"
                  onClick={() => table.resetColumnVisibility()}
                  title="Đặt lại cài đặt hiển thị cột ban đầu"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1 shrink-0" />
                  <span className="whitespace-nowrap">Mặc định</span>
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {actions}
      </div>
    </div>
  );
}
