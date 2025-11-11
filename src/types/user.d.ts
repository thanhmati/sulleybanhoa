import { ROLE } from '@/lib/constants/role.constant';

export interface IUser {
  id: string;
  fullName: string;
  email: string;
  roles: string[];
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
  roles: string[];
  roleNames: ROLE[];
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateUser {
  fullName: string;
  email: string;
  roles: string[];
}

export interface IUpdateUserRoles {
  roles: string[];
}
