import type { ColumnDef } from '@tanstack/react-table';
import { IUserListItem } from '@/types/user';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';
import { ROLE, ROLE_LABEL } from '@/lib/constants/role.constant';

export const userColumns = (): ColumnDef<IUserListItem>[] => [
  {
    accessorKey: 'fullName',
    header: 'Họ và tên',
    cell: ({ getValue }) => <span>{getValue<string>()}</span>,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ getValue }) => <span>{getValue<string>()}</span>,
  },
  {
    accessorKey: 'roleNames',
    header: 'Vai trò',
    cell: ({ getValue }) => (
      <span>
        {getValue<ROLE[]>()
          ?.map((role) => ROLE_LABEL[role])
          ?.join(', ')}
      </span>
    ),
  },
  {
    accessorKey: 'avatar',
    header: 'Avatar',
    enableSorting: false,
    cell: ({ getValue }) => (
      <Avatar className="h-8 w-8">
        <AvatarImage src={getValue<string>()} />
        <AvatarFallback>👤</AvatarFallback>
      </Avatar>
    ),
  },
];
