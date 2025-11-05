interface client {
  name: string;
  phoneNumber?: string;
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
  createdAt: Date;
  updatedAt: Date;
}
