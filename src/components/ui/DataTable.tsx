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

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];

  // --- Behavior flags
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enablePagination?: boolean;
  enableColumnVisibility?: boolean;

  // --- UI Injection
  toolbar?: (table: Table<TData>) => React.ReactNode; // optional toolbar area
  footer?: ReactNode; // optional footer (custom summary etc.)
  pagination?: ReactNode; // replace default pagination with your own

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
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows?.length ? (
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
                    {emptyState ?? 'No data available'}
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
