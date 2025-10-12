export interface Order {
  id: string;
  deliveryTime: Date;
  zalo: string;
  instagram: string;
  facebook: string;
  address: string;
  type: string;
  tone: string;
  price: number;
  isDeposit: boolean;
  ship: number;
  note: string;
  status: ORDER_STATUS;
  orderNumber: number;
  createdAt: Date;
  updatedAt: Date;
}
