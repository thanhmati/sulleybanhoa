import { TRANSACTION_TYPE } from '@/lib/constants/order.constant';

interface client {
  name: string;
  phoneNumber?: string;
}

export interface ITransaction {
  amount: number;
  type: TRANSACTION_TYPE;
  paymentDate: string;
}

export interface Order {
  id: string;
  deliveryTime: string;
  deliveryDate: Date;
  client: client;
  address: string;
  type: string;
  tone: string;
  price: number;
  deposit: number;
  ship: number;
  note: string;
  status: ORDER_STATUS;
  orderNumber: string;
  dueAmount: number;
  transaction: ITransaction[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IPayOrder {
  amount: number;
  type: TRANSACTION_TYPE;
  paymentDate: string;
}
