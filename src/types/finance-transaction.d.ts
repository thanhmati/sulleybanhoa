import {
  FINANCE_CATEGORY,
  TRANSACTION_DIRECTION,
} from '@/lib/constants/finance-transaction.constant';

interface IFinanceCategory {
  id: string;
  name: FINANCE_CATEGORY;
  type: TRANSACTION_DIRECTION;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFinanceTransaction {
  id: string;
  amount: number;
  note?: string;
  categoryId: string;
  category: IFinanceCategory;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateFinanceTransaction {
  amount: number;
  note?: string;
  categoryId: string;
}
