import { DataTable } from '@/components/ui/DataTable';
import { columns, Payment } from './components/columns';
import { DataTableToolbar } from '@/components/ui/DataTableToolbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function getData(): Payment[] {
  // Fetch data from your API here.
  return [
    {
      id: '728ed52f',
      amount: 100,
      status: 'pending',
      email: 'm@example.com',
    },
    {
      id: '728ed53f',
      amount: 200,
      status: 'pending',
      email: 'n@example.com',
    },
    // ...
  ];
}

export default function OrderListPage() {
  const data = getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={data}
        toolbar={(table) => (
          <DataTableToolbar
            filters={
              <Input
                placeholder="Search email..."
                value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
                onChange={(e) => table.getColumn('email')?.setFilterValue(e.target.value)}
                className="max-w-sm"
              />
            }
            actions={<Button>Add user</Button>}
          />
        )}
      />
    </div>
  );
}
