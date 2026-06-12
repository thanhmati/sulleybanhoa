import { supabase } from '@/lib/supabase';
import { ORDER_STATUS } from '@/lib/constants/order.constant';
import type { IPayOrder, Order } from '@/types/order';

export function mapOrderFromDb(dbOrder: any): Order {
  return {
    id: dbOrder.id,
    orderNumber: dbOrder.order_number,
    deliveryTime: dbOrder.delivery_time || '',
    deliveryDate: new Date(dbOrder.delivery_date),
    client: {
      name: dbOrder.client_name,
      phoneNumber: dbOrder.client_phone || undefined,
    },
    address: dbOrder.address,
    type: dbOrder.type,
    tone: dbOrder.tone,
    price: Number(dbOrder.price),
    deposit: Number(dbOrder.deposit),
    ship: Number(dbOrder.ship),
    note: dbOrder.note || '',
    status: dbOrder.status,
    dueAmount: Number(dbOrder.due_amount),
    isPaid: dbOrder.is_paid,
    createdAt: new Date(dbOrder.created_at),
    updatedAt: new Date(dbOrder.updated_at),
    transaction: (dbOrder.transaction || []).map((t: any) => ({
      amount: Number(t.amount),
      type: t.type,
      paymentDate: t.payment_date,
    })),
  };
}

function mapOrderToDb(order: Partial<Order>): any {
  const dbOrder: any = {};
  if (order.deliveryTime !== undefined) dbOrder.delivery_time = order.deliveryTime;
  if (order.deliveryDate !== undefined) {
    const d: any = order.deliveryDate;
    dbOrder.delivery_date =
      d instanceof Date
        ? d.toISOString().split('T')[0]
        : typeof d === 'string'
          ? d.split('T')[0]
          : d;
  }
  if (order.client !== undefined) {
    if (order.client.name !== undefined) dbOrder.client_name = order.client.name;
    if (order.client.phoneNumber !== undefined) dbOrder.client_phone = order.client.phoneNumber;
  }
  if (order.address !== undefined) dbOrder.address = order.address;
  if (order.type !== undefined) dbOrder.type = order.type;
  if (order.tone !== undefined) dbOrder.tone = order.tone;
  if (order.price !== undefined) dbOrder.price = order.price;
  if (order.deposit !== undefined) dbOrder.deposit = order.deposit;
  if (order.ship !== undefined) dbOrder.ship = order.ship;
  if (order.note !== undefined) dbOrder.note = order.note;
  if (order.status !== undefined) dbOrder.status = order.status;
  return dbOrder;
}

export const orderService = {
  getAll: async (): Promise<Order[]> => {
    const { data, error } = await supabase
      .from('orders')
      .select('*, transaction:order_transactions(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapOrderFromDb);
  },

  create: async (data: Partial<Order>): Promise<Order> => {
    const dbData = mapOrderToDb(data);
    const { data: dbOrder, error } = await supabase.from('orders').insert(dbData).select().single();

    if (error) throw error;
    return mapOrderFromDb(dbOrder);
  },

  update: async (id: string, data: Partial<Order>): Promise<Order> => {
    const dbData = mapOrderToDb(data);
    const { data: dbOrder, error } = await supabase
      .from('orders')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapOrderFromDb(dbOrder);
  },

  updateStatus: async (id: string, status: ORDER_STATUS): Promise<string> => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);

    if (error) throw error;
    return 'Status updated successfully';
  },

  delete: async (id: string): Promise<string> => {
    const { error } = await supabase.from('orders').delete().eq('id', id);

    if (error) throw error;
    return 'Order deleted successfully';
  },

  getById: async (id: string): Promise<Order> => {
    const { data: dbOrder, error } = await supabase
      .from('orders')
      .select('*, transaction:order_transactions(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return mapOrderFromDb(dbOrder);
  },

  pay: async (id: string, data: IPayOrder): Promise<string> => {
    const { error } = await supabase.from('order_transactions').insert({
      order_id: id,
      amount: data.amount,
      type: data.type,
      payment_date: data.paymentDate,
    });

    if (error) throw error;
    return 'Payment processed successfully';
  },
};
