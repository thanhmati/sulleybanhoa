import { Button } from '@/components/ui/button';
import { CurrencyInput } from '@/components/ui/currency-input';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePayOrder } from '@/hooks/useOrders';
import { TRANSACTION_TYPE, TRANSACTION_TYPE_LABEL } from '@/lib/constants/order.constant';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select } from '@radix-ui/react-select';
import dayjs from 'dayjs';
import { Controller, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import z from 'zod';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const transactionSchema = z.object({
  type: z.enum(TRANSACTION_TYPE, { error: 'Vui lòng chọn loại giao dịch' }),
  amount: z.number().min(1, 'Vui lòng nhập số tiền'),
  paymentDate: z.string().min(1, 'Vui chọn ngày thanh toán'),
});

const defaultValues: z.infer<typeof transactionSchema> = {
  type: TRANSACTION_TYPE.BANK,
  amount: 0,
  paymentDate: dayjs().toISOString(),
};

type TransactionFormValues = z.infer<typeof transactionSchema>;

export default function TransactionDialog({ open, onOpenChange }: Props) {
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues,
  });

  const { id: orderId } = useParams();

  const payOrder = usePayOrder();
  const isLoading = payOrder.isPending;

  const { errors } = form.formState;

  console.log('errors', errors);

  const onSubmit = (values: TransactionFormValues) => {
    if (!orderId) return;

    payOrder.mutate(
      { id: orderId, data: values },
      {
        onSuccess: () => {
          toast.success('Tạo giao dịch thành công');
          onOpenChange(false);
        },
        onError: (error: any) =>
          toast.error(error?.response?.data?.message || 'Tạo giao dịch thất bại'),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Thông tin giao dịch</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <div className="grid grid-cols-2 gap-6 my-4">
            <FormField
              control={form.control}
              name="amount"
              render={() => (
                <FormItem>
                  <FormLabel>Giá tiền</FormLabel>
                  <FormControl>
                    <Controller
                      control={form.control}
                      name="amount"
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
              name="paymentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày thanh toán</FormLabel>
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
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại giao dịch</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại giao dịch" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(TRANSACTION_TYPE).map((status) => (
                          <SelectItem key={status} value={status}>
                            {TRANSACTION_TYPE_LABEL[status]}
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
            <Button type="button" disabled={isLoading} onClick={form.handleSubmit(onSubmit)}>
              {isLoading ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
