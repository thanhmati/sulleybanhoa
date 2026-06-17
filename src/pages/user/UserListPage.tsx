import { DataTable } from '@/components/ui/DataTable';
import { DataTableToolbar } from '@/components/ui/DataTableToolbar';
import { Button } from '@/components/ui/button';
import { PlusCircleIcon } from 'lucide-react';
import { userColumns } from './components/columns';
import { useDeleteUser, useUsersQuery } from '@/hooks/useUsers';
import { useState } from 'react';
import { IUserListItem } from '@/types/user';
import { toast } from 'sonner';
import { UserFormDialog } from './components/UserFormDialog';

export default function UserListPage() {
  const { data, isLoading } = useUsersQuery();

  const deleteUser = useDeleteUser();

  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUserListItem | null>(null);

  const handleCreate = () => {
    setSelectedUser(null);
    setOpen(true);
  };

  const handleEdit = (user: IUserListItem) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleDelete = (orderId: string) => {
    deleteUser.mutate(orderId, {
      onSuccess: () => {
        toast.success('Xoá tài khoản thành công!');
      },
      onError: () => toast.error('Không thể xoá tài khoản này'),
    });
  };

  return (
    <div className="container mx-auto p-6">
      <DataTable
        isLoading={isLoading}
        columns={userColumns(handleEdit, handleDelete)}
        data={data || []}
        externalState={{
          sorting: [{ id: 'fullName', desc: false }],
        }}
        toolbar={() => (
          <DataTableToolbar
            actions={
              <Button onClick={handleCreate}>
                <PlusCircleIcon className="mr-2 h-4 w-4" />
                Tạo tài khoản
              </Button>
            }
          />
        )}
      />
      <UserFormDialog open={open} onOpenChange={setOpen} initialData={selectedUser} />
    </div>
  );
}
