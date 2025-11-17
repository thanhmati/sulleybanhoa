import { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useOrderDetailQuery, useUpdateOrder } from '@/hooks/useOrders';
import { ORDER_STATUS, TRANSACTION_TYPE } from '@/lib/constants/order.constant';
import { Form } from '@/components/ui/form';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import FormLayout from '@/components/form-layout';
import OrderForm from './OrderForm';
import OrderFooter from './OrderFooter';

const clientSchema = z.object({
  name: z.string().min(1, 'Tên khách hàng không được để trống'),
  phoneNumber: z.string().optional(),
});

const transactionSchema = z.object({
  type: z.enum(TRANSACTION_TYPE),
  amount: z.number(),
  paymentDate: z.string(),
});

const orderSchema = z.object({
  client: clientSchema,
  orderNumber: z.string().optional(),
  address: z.string().min(1, 'Địa chỉ không được để trống'),
  type: z.string().min(1, 'Vui lòng nhập loại sản phẩm'),
  tone: z.string().min(1, 'Vui lòng nhập tone màu'),
  price: z.number().min(0, 'Giá tiền không hợp lệ'),
  ship: z.number().min(0, 'Phí ship không hợp lệ'),
  note: z.string().optional(),
  status: z.enum(ORDER_STATUS).optional(),
  deliveryTime: z.string().min(1, 'Vui lòng nhập thời gian giao'),
  deliveryDate: z.string().min(1, 'Vui lòng chọn ngày giao'),
  deposit: z.number().min(0, 'Tiền cọc không hợp lệ').optional(),
  transactions: z.array(transactionSchema).optional(),
});

const defaultValues: OrderFormValues = {
  client: {
    name: '',
    phoneNumber: '',
  },
  orderNumber: '',
  address: '',
  type: '',
  tone: '',
  price: 0,
  ship: 0,
  note: '',
  status: ORDER_STATUS.PENDING,
  deliveryTime: '',
  deliveryDate: '',
  deposit: 0,
};

type OrderFormValues = z.infer<typeof orderSchema>;

export function OrderDetailPage() {
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues,
  });

  const { id: orderId } = useParams();

  const { data: order } = useOrderDetailQuery(orderId || '');

  useEffect(() => {
    form.reset(defaultValues);

    if (order) {
      form.reset({
        ...order,
        deliveryDate: dayjs(order.deliveryDate).toISOString(),
      });
    }
  }, [form, order]);

  const updateOrder = useUpdateOrder();

  const onSubmit = (values: OrderFormValues) => {
    if (!order) return;

    const payload = {
      ...values,
      deliveryDate: values.deliveryDate ? new Date(values.deliveryDate) : new Date(),
    };

    updateOrder.mutate(
      { id: order.id, data: payload },
      {
        onSuccess: () => {
          toast.success('Cập nhật đơn hàng thành công!');
        },
        onError: () => toast.error('Cập nhật thất bại'),
      },
    );
  };

  const isLoading = updateOrder.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormLayout form={<OrderForm />} footer={<OrderFooter isLoading={isLoading} />} />
      </form>
    </Form>
  );
}
