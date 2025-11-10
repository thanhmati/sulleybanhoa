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
