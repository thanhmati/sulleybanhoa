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
  deposit: number;
  ship: number;
  note: string;
  status: ORDER_STATUS;
  orderNumber: string;
  createdAt: Date;
  updatedAt: Date;
}
