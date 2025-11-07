import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDataTable } from './DataTableProvider';
import { Settings2Icon } from 'lucide-react'; // 🔧 icon cho button Columns

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

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full">
      {/* LEFT: Filters */}
      <div className="flex items-center gap-2 sm:justify-start w-full sm:w-auto">{filters}</div>

      {/* RIGHT: Column visibility + Actions */}
      <div className="flex items-center gap-2 sm:justify-end w-full sm:w-auto">
        {showColumnVisibility && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Settings2Icon className="h-4 w-4" />
                Hiển thị cột
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide() && column.columnDef.header?.toString())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.columnDef.header?.toString()}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {actions}
      </div>
    </div>
  );
}
