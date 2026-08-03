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
import { useFlowerTypesQuery } from '@/hooks/useFlowerTypes';
import {
  useCreateFinanceTransaction,
  useUpdateFinanceTransaction,
} from '@/hooks/useFinanceTransaction';
import {
  FINANCE_CATEGORY,
  FINANCE_CATEGORY_LABEL,
} from '@/lib/constants/finance-transaction.constant';
import { IFinanceTransaction } from '@/types/finance-transaction';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { Check, Tag } from 'lucide-react';
import { useEffect, useState } from 'react';
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
  date: dayjs().format('YYYY-MM-DD'),
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: IFinanceTransaction;
}

export function FinanceTransactionFormDialog({ open, onOpenChange, data }: Props) {
  const [selectedFlowerNames, setSelectedFlowerNames] = useState<string[]>([]);

  const form = useForm<FinanceTransactionFormValues>({
    resolver: zodResolver(financeTransactionSchema),
    defaultValues,
  });

  const isEditing = !!data;

  const createTransaction = useCreateFinanceTransaction();
  const updateTransaction = useUpdateFinanceTransaction();

  const { data: categories } = useFinanceCategoriesQuery();
  const { data: dbFlowerTypes = [] } = useFlowerTypesQuery();

  const selectedCategoryId = form.watch('categoryId');
  const selectedCategory = categories?.find((c) => c.id === selectedCategoryId);

  // Check if selected category is "Nhập hoa" (FLOWER_STOCK)
  const isFlowerImport =
    selectedCategory &&
    (selectedCategory.name === FINANCE_CATEGORY.FLOWER_STOCK ||
      FINANCE_CATEGORY_LABEL[selectedCategory.name] === 'Nhập hoa' ||
      selectedCategory.name?.toLowerCase().includes('hoa'));

  useEffect(() => {
    if (!open) {
      form.reset(defaultValues);
      setSelectedFlowerNames([]);
    }
  }, [open, form]);

  useEffect(() => {
    if (data) {
      form.reset(data);
      // If editing existing note containing flower import list
      if (data.note && data.note.includes('Nhập hoa:')) {
        const match = data.note.match(/Nhập hoa:\s*([^|]+)/);
        if (match && match[1]) {
          const names = match[1]
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
          setSelectedFlowerNames(names);
        }
      }
    }
  }, [data, form]);

  const toggleFlowerType = (name: string) => {
    const isSelected = selectedFlowerNames.includes(name);
    const nextNames = isSelected
      ? selectedFlowerNames.filter((item) => item !== name)
      : [...selectedFlowerNames, name];

    setSelectedFlowerNames(nextNames);

    // Format and append/replace "Nhập hoa: ..." in the note field
    const flowerNotePrefix = nextNames.length > 0 ? `Nhập hoa: ${nextNames.join(', ')}` : '';
    const currentNote = form.getValues('note') || '';

    let updatedNote = '';
    if (currentNote.includes('Nhập hoa:')) {
      const parts = currentNote.split(/\s*\|\s*/);
      const otherParts = parts.filter((p) => !p.trim().startsWith('Nhập hoa:'));
      updatedNote = flowerNotePrefix
        ? [flowerNotePrefix, ...otherParts].join(' | ')
        : otherParts.join(' | ');
    } else {
      updatedNote = currentNote ? `${flowerNotePrefix} | ${currentNote}` : flowerNotePrefix;
    }

    form.setValue('note', updatedNote, { shouldValidate: true });
  };

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
          onError: () => toast.error('Cập nhật thất bại'),
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
                            <Select
                              value={value}
                              onValueChange={(val) => {
                                onChange(val);
                                // If switching away from Nhập hoa, clear flower selections if appropriate
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Loại giao dịch" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories?.map((category) => (
                                  <SelectItem key={category.id} value={category.id}>
                                    {FINANCE_CATEGORY_LABEL[category.name] || category.name}
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
                          onChange={(val) =>
                            field.onChange(val ? dayjs(val).format('YYYY-MM-DD') : '')
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Selective Flower Type Selector for "Nhập hoa" Transactions */}
                {isFlowerImport && (
                  <div className="col-span-12 space-y-2 p-3.5 rounded-xl bg-card border border-border/80">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <Tag size={14} className="text-primary" /> Chọn các loại hoa nhập vào
                      </span>
                      <span className="text-[11px] text-muted-foreground font-medium">
                        Đã chọn:{' '}
                        <strong className="text-foreground">{selectedFlowerNames.length}</strong>
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 p-2.5 rounded-lg bg-background border border-border min-h-[44px]">
                      {dbFlowerTypes.length > 0 ? (
                        dbFlowerTypes.map((ft) => {
                          const isSelected = selectedFlowerNames.includes(ft.name);
                          return (
                            <button
                              key={ft.id}
                              type="button"
                              onClick={() => toggleFlowerType(ft.name)}
                              className={`text-xs px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 cursor-pointer font-medium ${
                                isSelected
                                  ? 'bg-primary text-primary-foreground border-primary font-semibold shadow-xs'
                                  : 'bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground'
                              }`}
                            >
                              {isSelected && <Check size={11} />}
                              {ft.name}
                            </button>
                          );
                        })
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          Chưa có loại hoa nào trong hệ thống
                        </span>
                      )}
                    </div>
                  </div>
                )}

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
