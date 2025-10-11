import { createContext, useContext } from 'react';
import type { Table } from '@tanstack/react-table';

const DataTableContext = createContext<Table<any> | null>(null);

export function DataTableProvider<TData>({
  table,
  children,
}: {
  table: Table<TData>;
  children: React.ReactNode;
}) {
  return <DataTableContext.Provider value={table}>{children}</DataTableContext.Provider>;
}

export function useDataTable<TData>() {
  const ctx = useContext(DataTableContext);
  if (!ctx) throw new Error('useDataTable must be used inside <DataTableProvider>');
  return ctx as Table<TData>;
}
