import { DataTable } from '@/components/ui/DataTable';
import { userColumns } from './components/columns';
import { useUsersQuery } from '@/hooks/useUsers';

export default function UserListPage() {
  const { data, isLoading } = useUsersQuery();

  return (
    <div className="container mx-auto py-10">
      <DataTable
        isLoading={isLoading}
        columns={userColumns()}
        data={data || []}
        externalState={{
          sorting: [{ id: 'fullName', desc: false }],
        }}
      />
    </div>
  );
}
