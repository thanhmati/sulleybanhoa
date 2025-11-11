import { DataTable } from '@/components/ui/DataTable';
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
    <div className="container mx-auto py-10">
      <DataTable
        isLoading={isLoading}
        columns={userColumns(handleEdit, handleDelete)}
        data={data || []}
        externalState={{
          sorting: [{ id: 'fullName', desc: false }],
        }}
      />
      <UserFormDialog open={open} onOpenChange={setOpen} initialData={selectedUser} />
    </div>
  );
}
