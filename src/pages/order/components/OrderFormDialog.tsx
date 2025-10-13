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
import { ORDER_STATUS } from '@/lib/constants/order.constant';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { CurrencyInput } from '@/components/ui/currency-input';

const orderSchema = z.object({
  orderNumber: z.string(),
  zalo: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  address: z.string().min(1),
  type: z.string().min(1),
  tone: z.string().min(1),
  price: z.number().min(0),
  ship: z.number().min(0),
  note: z.string().optional(),
  status: z.enum(ORDER_STATUS),
  deliveryTime: z.string().optional(),
  deposit: z.number().min(0).optional(),
});

type OrderFormValues = z.infer<typeof orderSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Order | null;
}

export function OrderFormDialog({ open, onOpenChange, initialData }: Props) {
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      orderNumber: '',
      zalo: '',
      instagram: '',
      facebook: '',
      address: '',
      type: '',
      tone: '',
      price: 0,
      ship: 0,
      note: '',
      status: ORDER_STATUS.PENDING,
      deliveryTime: '',
      deposit: 0,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        deliveryTime: initialData.deliveryTime
          ? new Date(initialData.deliveryTime).toISOString().slice(0, 16)
          : '',
      });
    }
  }, [form, initialData]);

  const createOrder = useCreateOrder();
  const updateOrder = useUpdateOrder();

  const onSubmit = (values: OrderFormValues) => {
    const payload = {
      ...values,
      deliveryTime: values.deliveryTime ? new Date(values.deliveryTime) : new Date(),
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
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Chỉnh sửa đơn hàng' : 'Tạo đơn hàng'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="deliveryTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thời gian giao</FormLabel>
                    <FormControl>
                      <DateTimePicker
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
                name="type"
                render={({ field }) => (
                  <FormItem>
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
                  <FormItem>
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
                name="zalo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zalo</FormLabel>
                    <FormControl>
                      <Input type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IG</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>FB</FormLabel>
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
                  <FormItem className="col-span-3">
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
                  <FormItem>
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
                  <FormItem>
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
                  <FormItem>
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
                  <FormItem className="col-span-3">
                    <FormLabel>Ghi chú</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
