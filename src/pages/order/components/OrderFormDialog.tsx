import { useEffect } from 'react';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { useCreateOrder, useUpdateOrder } from '@/hooks/useOrders';
import { Order } from '@/types/order';
import { ORDER_STATUS, ORDER_STATUS_LABEL } from '@/lib/constants/order.constant';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { DatePicker } from '@/components/ui/date-picker';
import { CurrencyInput } from '@/components/ui/currency-input';
import dayjs from 'dayjs';
import { Separator } from '@/components/ui/separator';

const clientSchema = z.object({
  name: z.string().min(1, 'Tên khách hàng không được để trống'),
  phoneNumber: z.string().optional(),
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

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Order | null;
}

export function OrderFormDialog({ open, onOpenChange, initialData }: Props) {
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);

    if (initialData) {
      form.reset({
        ...initialData,
        deliveryDate: dayjs(initialData.deliveryDate).toISOString(),
      });
    }
  }, [form, initialData]);

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const createOrder = useCreateOrder();
  const updateOrder = useUpdateOrder();

  const onSubmit = (values: OrderFormValues) => {
    const payload = {
      ...values,
      deliveryDate: values.deliveryDate ? new Date(values.deliveryDate) : new Date(),
    };

    if (initialData) {
      updateOrder.mutate(
        { id: initialData.id, data: payload },
        {
          onSuccess: () => {
            toast.success('Cập nhật đơn hàng thành công!');
            onOpenChange(false);
          },
          onError: () => toast.error('Cập nhật thất bại'),
        },
      );
    } else {
      createOrder.mutate(payload, {
        onSuccess: () => {
          toast.success('Tạo đơn hàng thành công!');
          onOpenChange(false);
        },
        onError: () => toast.error('Tạo thất bại'),
      });
    }
  };

  const isLoading = createOrder.isPending || updateOrder.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Chỉnh sửa đơn hàng' : 'Tạo đơn hàng'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground mt-2">
              Thông tin khách hàng
            </h3>
            <Separator className="my-3" />

            <div className="grid grid-cols-2 gap-4 my-4">
              <FormField
                control={form.control}
                name="client.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên khách hàng</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="client.phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-sm font-semibold text-muted-foreground">Thông tin đơn hàng</h3>
            <Separator className="my-3" />

            <div className="grid grid-cols-12 gap-4 my-4">
              <FormField
                control={form.control}
                name="deliveryDate"
                render={({ field }) => (
                  <FormItem className="col-span-6">
                    <FormLabel>Ngày giao</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value ? new Date(field.value) : undefined}
                        onChange={(val) => field.onChange(val?.toISOString() ?? '')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deliveryTime"
                render={({ field }) => (
                  <FormItem className="col-span-6">
                    <FormLabel>Giờ giao hàng</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="col-span-6">
                    <FormLabel>Loại</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tone"
                render={({ field }) => (
                  <FormItem className="col-span-6">
                    <FormLabel>Tone</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="col-span-12">
                    <FormLabel>Địa chỉ</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={() => (
                  <FormItem className="col-span-4">
                    <FormLabel>Giá tiền</FormLabel>
                    <FormControl>
                      <Controller
                        control={form.control}
                        name="price"
                        render={({ field: { value, onChange } }) => (
                          <CurrencyInput value={value} onChange={onChange} />
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deposit"
                render={() => (
                  <FormItem className="col-span-4">
                    <FormLabel>Cọc</FormLabel>
                    <FormControl>
                      <Controller
                        control={form.control}
                        name="deposit"
                        render={({ field: { value, onChange } }) => (
                          <CurrencyInput value={value} onChange={onChange} />
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ship"
                render={() => (
                  <FormItem className="col-span-4">
                    <FormLabel>Phí ship</FormLabel>
                    <FormControl>
                      <Controller
                        control={form.control}
                        name="ship"
                        render={({ field: { value, onChange } }) => (
                          <CurrencyInput value={value} onChange={onChange} />
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem className="col-span-12">
                    <FormLabel>Ghi chú</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {initialData && (
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng thái</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(ORDER_STATUS).map((status) => (
                              <SelectItem key={status} value={status}>
                                {ORDER_STATUS_LABEL[status]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Huỷ
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
