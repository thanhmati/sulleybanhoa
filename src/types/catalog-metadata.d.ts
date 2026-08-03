export interface ICategory {
  id: string;
  key?: string;
  name: string;
  description?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface ICreateCategoryPayload {
  name: string;
  key?: string;
  description?: string;
}

export interface IUpdateCategoryPayload extends Partial<ICreateCategoryPayload> {
  id: string;
}

export interface IFlowerType {
  id: string;
  name: string;
  description?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface ICreateFlowerTypePayload {
  name: string;
  description?: string;
}

export interface IUpdateFlowerTypePayload extends Partial<ICreateFlowerTypePayload> {
  id: string;
}

export interface IOccasion {
  id: string;
  name: string;
  description?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface ICreateOccasionPayload {
  name: string;
  description?: string;
}

export interface IUpdateOccasionPayload extends Partial<ICreateOccasionPayload> {
  id: string;
}
