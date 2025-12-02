import FormSectionWrapper from '@/components/form-section-wrapper';
import { Button } from '@/components/ui/button';
import { CurrencyInput } from '@/components/ui/currency-input';
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
import { useCreateFinanceTransaction } from '@/hooks/useFinanceTransaction';
import { FINANCE_CATEGORY_LABEL } from '@/lib/constants/finance-transaction.constant';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const financeTransactionSchema = z.object({
  amount: z.number().min(1, 'Vui lòng nhập số tiền'),
  categoryId: z.string().min(1, 'Vui lòng chọn loại giao dịch'),
  note: z.string().optional(),
});

type FinanceTransactionFormValues = z.infer<typeof financeTransactionSchema>;

const defaultValues: FinanceTransactionFormValues = {
  amount: 0,
  categoryId: '',
  note: '',
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FinanceTransactionFormDialog({ open, onOpenChange }: Props) {
  const form = useForm<FinanceTransactionFormValues>({
    resolver: zodResolver(financeTransactionSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const createTransaction = useCreateFinanceTransaction();

  const { data: categories } = useFinanceCategoriesQuery();

  const isLoading = createTransaction.isPending;

  const onSubmit = (values: FinanceTransactionFormValues) => {
    createTransaction.mutate(values, {
      onSuccess: () => {
        toast.success('Tạo giao dịch thành công!');
        onOpenChange(false);
      },
      onError: () => toast.error('Tạo thất bại'),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Tạo giao dịch</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormSectionWrapper title="Thông tin giao dịch">
              <div className="grid gap-4 my-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={() => (
                    <FormItem className="col-span-6">
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
                    <FormItem className="col-span-6">
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
