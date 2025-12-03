import FormSectionWrapper from '@/components/form-section-wrapper';
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFinanceCategoriesQuery } from '@/hooks/useFinanceCategory';
import {
  useCreateFinanceTransaction,
  useUpdateFinanceTransaction,
} from '@/hooks/useFinanceTransaction';
import { FINANCE_CATEGORY_LABEL } from '@/lib/constants/finance-transaction.constant';
import { IFinanceTransaction } from '@/types/finance-transaction';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const financeTransactionSchema = z.object({
  amount: z.number().min(1, 'Vui lòng nhập số tiền'),
  categoryId: z.string().min(1, 'Vui lòng chọn loại giao dịch'),
  note: z.string().optional(),
  date: z.string().min(1, 'Vui lòng nhập ngày'),
});

type FinanceTransactionFormValues = z.infer<typeof financeTransactionSchema>;

const defaultValues: FinanceTransactionFormValues = {
  amount: 0,
  categoryId: '',
  note: '',
  date: dayjs().toISOString(),
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: IFinanceTransaction;
}

export function FinanceTransactionFormDialog({ open, onOpenChange, data }: Props) {
  const form = useForm<FinanceTransactionFormValues>({
    resolver: zodResolver(financeTransactionSchema),
    defaultValues,
  });

  const isEditing = !!data;

  useEffect(() => {
    if (!open) {
      form.reset(defaultValues);
    }
  }, [open, form]);

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form]);

  const createTransaction = useCreateFinanceTransaction();
  const updateTransaction = useUpdateFinanceTransaction();

  const { data: categories } = useFinanceCategoriesQuery();

  const isLoading = createTransaction.isPending || updateTransaction.isPending;

  const onSubmit = (values: FinanceTransactionFormValues) => {
    if (isEditing && data.id) {
      updateTransaction.mutate(
        { id: data.id, data: values },
        {
          onSuccess: () => {
            toast.success('Cập nhật giao dịch thành công!');
            onOpenChange(false);
          },
          onError: () => toast.error('Tạo thất bại'),
        },
      );
    } else {
      createTransaction.mutate(values, {
        onSuccess: () => {
          toast.success('Tạo giao dịch thành công!');
          onOpenChange(false);
        },
        onError: () => toast.error('Tạo thất bại'),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Cập nhật giao dịch' : 'Tạo giao dịch'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormSectionWrapper title="Thông tin giao dịch">
              <div className="grid grid-cols-12 gap-4 my-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={() => (
                    <FormItem className="col-span-4">
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
                  name="categoryId"
                  render={() => (
                    <FormItem className="col-span-4">
                      <FormLabel>Loại giao dịch</FormLabel>
                      <FormControl>
                        <Controller
                          control={form.control}
                          name="categoryId"
                          render={({ field: { value, onChange } }) => (
                            <Select value={value} onValueChange={onChange}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Loại giao dịch" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories?.map((category) => (
                                  <SelectItem key={category.id} value={category.id}>
                                    {FINANCE_CATEGORY_LABEL[category.name]}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="col-span-4">
                      <FormLabel>Ngày giao dịch</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value ? dayjs(field.value).toDate() : undefined}
                          onChange={(val) => field.onChange(val?.toISOString() ?? '')}
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
              </div>
            </FormSectionWrapper>

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
