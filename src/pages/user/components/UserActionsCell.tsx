import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { IUserListItem } from '@/types/user';

interface UserActionsCellProps {
  user: IUserListItem;
  onEdit: (user: IUserListItem) => void;
  onDelete: (id: string) => void;
}

export function UserActionsCell({ user, onEdit, onDelete }: UserActionsCellProps) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUserListItem>();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onEdit?.(user)}>Chỉnh sửa</DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setOpenConfirm(true);
              setSelectedUser(user);
            }}
          >
            Xoá
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={openConfirm}
        onOpenChange={setOpenConfirm}
        title="Xác nhận xoá"
        description={
          <>
            Bạn có chắc muốn xoá tài khoản <strong>{user.email}</strong> không?
            <br />
            Hành động này <b>không thể hoàn tác</b>.
          </>
        }
        confirmText="Xoá"
        variant="destructive"
        onConfirm={() => {
          if (selectedUser?.id) {
            onDelete(selectedUser.id);
          }
        }}
      />
    </>
  );
}
