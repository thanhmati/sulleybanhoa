import { ROLE } from '@/lib/constants/role.constant';

export interface IUser {
  id: string;
  fullName: string;
  email: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUpdateUser {
  fullName: string;
  avatar?: string;
}

export interface IUserListItem {
  id: string;
  fullName: string;
  email: string;
  avatar: string;
  roleNames: ROLE[];
  createdAt: Date;
  updatedAt: Date;
}
