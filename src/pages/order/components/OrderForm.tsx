import FormSectionWrapper from '@/components/form-section-wrapper';
import { CurrencyInput } from '@/components/ui/currency-input';
import { DatePicker } from '@/components/ui/date-picker';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ORDER_STATUS, ORDER_STATUS_LABEL } from '@/lib/constants/order.constant';
import { Controller, useFormContext } from 'react-hook-form';
import PaymentInfo from './PaymentInfo';
import { ITransaction } from '@/types/order';

export default function OrderForm() {
  const { control, getValues } = useFormContext();

  const transactions = getValues('transaction') as ITransaction[];

  return (
    <div className="flex flex-col gap-6">
      <FormSectionWrapper title="Thông tin khách hàng">
        <div className="grid grid-cols-2 gap-6 my-4">
          <FormField
            control={control}
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
            control={control}
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
      </FormSectionWrapper>

      <FormSectionWrapper title="Thông tin đơn hàng">
        <div className="grid grid-cols-12 gap-6 my-4">
          <FormField
            control={control}
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
            control={control}
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
            control={control}
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
            control={control}
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
            control={control}
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
            control={control}
            name="price"
            render={() => (
              <FormItem className="col-span-4">
                <FormLabel>Giá tiền</FormLabel>
                <FormControl>
                  <Controller
                    control={control}
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
            control={control}
            name="deposit"
            render={() => (
              <FormItem className="col-span-4">
                <FormLabel>Cọc</FormLabel>
                <FormControl>
                  <Controller
                    control={control}
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
            control={control}
            name="ship"
            render={() => (
              <FormItem className="col-span-4">
                <FormLabel>Phí ship</FormLabel>
                <FormControl>
                  <Controller
                    control={control}
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
            control={control}
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

          <FormField
            control={control}
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
        </div>
      </FormSectionWrapper>

      {transactions?.length && (
        <FormSectionWrapper title="Thông tin thanh toán">
          <PaymentInfo transactions={transactions} />
        </FormSectionWrapper>
      )}
    </div>
  );
}
