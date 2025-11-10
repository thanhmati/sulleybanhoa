import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type PaginationState,
  Table,
} from '@tanstack/react-table';
import {
  Table as UiTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState, ReactNode, useMemo } from 'react';
import { DataTablePagination } from './DataTablePagination';
import { DataTableProvider } from './DataTableProvider';
import { flexRender } from '@tanstack/react-table';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];

  // --- Behavior flags
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enablePagination?: boolean;
  enableColumnVisibility?: boolean;

  // --- UI Injection
  toolbar?: (table: Table<TData>) => React.ReactNode;
  footer?: ReactNode;
  pagination?: ReactNode;

  // --- Loading state
  isLoading?: boolean;

  // --- Server-side / Controlled Mode
  manualPagination?: boolean;
  manualSorting?: boolean;
  manualFiltering?: boolean;
  pageCount?: number;

  // --- Controlled state (optional)
  externalState?: {
    sorting?: SortingState;
    pagination?: PaginationState;
    columnFilters?: ColumnFiltersState;
    columnVisibility?: VisibilityState;
  };

  // --- Events
  onSortingChange?: (state: SortingState) => void;
  onPaginationChange?: (state: PaginationState) => void;
  onColumnFiltersChange?: (state: ColumnFiltersState) => void;
  onColumnVisibilityChange?: (state: VisibilityState) => void;

  // --- Custom empty state UI
  emptyState?: ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  enableSorting = true,
  enableFiltering = true,
  enablePagination = true,
  manualPagination = false,
  manualSorting = false,
  manualFiltering = false,
  pageCount,
  toolbar,
  footer,
  pagination,
  emptyState,
  externalState,
  onSortingChange,
  onPaginationChange,
  onColumnFiltersChange,
  onColumnVisibilityChange,
}: DataTableProps<TData, TValue>) {
  // --- local state fallback if external not provided
  const [sorting, setSorting] = useState<SortingState>(externalState?.sorting ?? []);
  const [paginationState, setPaginationState] = useState<PaginationState>(
    externalState?.pagination ?? { pageIndex: 0, pageSize: 10 },
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    externalState?.columnFilters ?? [],
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    externalState?.columnVisibility ?? {},
  );

  const table = useReactTable({
    data,
    columns,
    manualPagination,
    manualSorting,
    manualFiltering,
    pageCount,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination: paginationState,
    },
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(sorting) : updater;
      setSorting(next);
      onSortingChange?.(next);
    },
    onPaginationChange: (updater) => {
      const next = typeof updater === 'function' ? updater(paginationState) : updater;
      setPaginationState(next);
      onPaginationChange?.(next);
    },
    onColumnFiltersChange: (updater) => {
      const next = typeof updater === 'function' ? updater(columnFilters) : updater;
      setColumnFilters(next);
      onColumnFiltersChange?.(next);
    },
    onColumnVisibilityChange: (updater) => {
      const next = typeof updater === 'function' ? updater(columnVisibility) : updater;
      setColumnVisibility(next);
      onColumnVisibilityChange?.(next);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
  });

  const memoizedTable = useMemo(() => table, [table]);

  return (
    <DataTableProvider table={memoizedTable}>
      <div className="space-y-4">
        {toolbar && <div className="flex items-center justify-between">{toolbar(table)}</div>}

        <div className="overflow-hidden rounded-md border">
          <UiTable>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort?.();
                    const sortDir = header.column.getIsSorted?.() as false | 'asc' | 'desc';
                    return (
                      <TableHead
                        key={header.id}
                        onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                        className={cn(canSort && 'cursor-pointer select-none hover:bg-muted/40')}
                      >
                        {header.isPlaceholder ? null : (
                          <div className="flex items-center justify-between">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {canSort ? (
                              sortDir === 'asc' ? (
                                <ArrowUp className="ml-1 h-3 w-3" />
                              ) : sortDir === 'desc' ? (
                                <ArrowDown className="ml-1 h-3 w-3" />
                              ) : (
                                <ArrowUpDown className="ml-1 h-3 w-3 opacity-40" />
                              )
                            ) : null}
                          </div>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {isLoading ? (
                // Skeleton loading rows
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    {columns.map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-6 w-full rounded" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {emptyState ?? 'Không có dữ liệu'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </UiTable>
        </div>

        {pagination ? pagination : enablePagination && <DataTablePagination />}

        {footer && <div>{footer}</div>}
      </div>
    </DataTableProvider>
  );
}
