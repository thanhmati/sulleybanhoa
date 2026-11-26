import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, CheckCircle2, Eye, Loader2, QrCode, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUpdateStoreSettingMutation } from '@/hooks/useStoreSettings';
import { ORDER_STATUS } from '@/lib/constants/order.constant';
import {
  DEFAULT_BANK_BIN,
  findVietnamBankByBin,
  VIETNAM_BANKS,
} from '@/lib/constants/vietnam-banks.constant';
import { buildOrderTransferContent, stripVietnameseDiacritics } from '@/lib/utils/vietqr';
import { OrderReceipt } from '@/pages/order/components/OrderReceipt';
import type { Order } from '@/types/order';
import type { BankAccountType, StoreInvoiceBankConfig } from '@/types/store-setting';

const invoiceBankSchema = z.object({
  storeName: z.string().trim().min(1, 'Vui lòng nhập tên tiệm hiển thị trên hoá đơn'),
  storePhone: z.string().trim().min(1, 'Vui lòng nhập SĐT cửa hàng'),
  bankBin: z.string().trim().min(1, 'Vui lòng chọn ngân hàng'),
  bankShortName: z.string().trim().min(1),
  bankAccountNumber: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập số tài khoản ngân hàng')
    .regex(/^[a-zA-Z0-9]+$/, 'Số tài khoản chỉ gồm chữ và số, không chứa khoảng trắng'),
  bankAccountName: z.string().trim().min(1, 'Vui lòng nhập tên chủ tài khoản'),
  bankAccountType: z.enum(['PERSONAL', 'BUSINESS_HOUSEHOLD', 'ENTERPRISE']).optional(),
  vaNumber: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9]*$/, 'Số VA chỉ gồm chữ và số')
    .optional(),
  transferPrefix: z.string().trim().max(20, 'Tiền tố tối đa 20 ký tự').optional(),
  footerText: z.string().trim().min(1, 'Vui lòng nhập lời cảm ơn cuối hoá đơn'),
});

type InvoiceBankFormValues = z.infer<typeof invoiceBankSchema>;

interface InvoiceBankConfigTabProps {
  initialConfig?: StoreInvoiceBankConfig;
}

const DEFAULT_VALUES: InvoiceBankFormValues = {
  storeName: 'SULLEY FLORAL STUDIO',
  storePhone: '034 908 1629',
  bankBin: DEFAULT_BANK_BIN,
  bankShortName: 'MBBank',
  bankAccountNumber: '',
  bankAccountName: '',
  bankAccountType: 'BUSINESS_HOUSEHOLD',
  vaNumber: '',
  transferPrefix: '',
  footerText: 'Cảm ơn quý khách và hẹn gặp lại',
};

const ACCOUNT_TYPE_LABELS: Record<BankAccountType, string> = {
  BUSINESS_HOUSEHOLD: 'Hộ kinh doanh cá nhân',
  PERSONAL: 'Tài khoản cá nhân',
  ENTERPRISE: 'Tài khoản doanh nghiệp',
};

const SAMPLE_PREVIEW_ORDER: Order = {
  id: 'preview-order-000001',
  orderNumber: 'ORD000001',
  deliveryTime: '15:30',
  deliveryDate: new Date(),
  client: { name: 'Đường Cẩm Tú' },
  address: 'TP.HCM',
  type: 'Bó hoa hồng pastel',
  tone: 'Hồng kem',
  price: 340000,
  deposit: 100000,
  ship: 30000,
  note: '',
  status: ORDER_STATUS.PENDING,
  dueAmount: 270000,
  transaction: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  isPaid: false,
  isPrepared: false,
};

export function InvoiceBankConfigTab({ initialConfig }: InvoiceBankConfigTabProps) {
  const updateMutation = useUpdateStoreSettingMutation();

  const form = useForm<InvoiceBankFormValues>({
    resolver: zodResolver(invoiceBankSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (initialConfig) {
      form.reset({
        storeName: initialConfig.storeName || DEFAULT_VALUES.storeName,
        storePhone: initialConfig.storePhone || DEFAULT_VALUES.storePhone,
        bankBin: initialConfig.bankBin || DEFAULT_VALUES.bankBin,
        bankShortName: initialConfig.bankShortName || DEFAULT_VALUES.bankShortName,
        bankAccountNumber: initialConfig.bankAccountNumber || '',
        bankAccountName: initialConfig.bankAccountName || '',
        bankAccountType: initialConfig.bankAccountType || 'BUSINESS_HOUSEHOLD',
        vaNumber: initialConfig.vaNumber || '',
        transferPrefix: initialConfig.transferPrefix || '',
        footerText: initialConfig.footerText || DEFAULT_VALUES.footerText,
      });
    }
  }, [initialConfig, form]);

  const watched = form.watch();
  const selectedBank = useMemo(() => findVietnamBankByBin(watched.bankBin), [watched.bankBin]);

  const sampleTransferContent = useMemo(
    () =>
      buildOrderTransferContent({
        orderNumber: 'ORD000001',
        transferPrefix: watched.transferPrefix,
        bankBin: watched.bankBin,
      }),
    [watched.transferPrefix, watched.bankBin],
  );

  const previewInvoiceConfig: StoreInvoiceBankConfig = useMemo(
    () => ({
      storeName: watched.storeName || DEFAULT_VALUES.storeName,
      storePhone: watched.storePhone || '',
      bankBin: watched.bankBin || DEFAULT_BANK_BIN,
      bankShortName: watched.bankShortName || 'MBBank',
      bankAccountNumber: watched.bankAccountNumber || '',
      bankAccountName: watched.bankAccountName || '',
      bankAccountType: watched.bankAccountType || 'BUSINESS_HOUSEHOLD',
      vaNumber: watched.vaNumber || '',
      transferPrefix: watched.transferPrefix || '',
      footerText: watched.footerText || DEFAULT_VALUES.footerText,
    }),
    [watched],
  );

  const handleSave = async (values: InvoiceBankFormValues) => {
    const normalizedPayload: StoreInvoiceBankConfig = {
      ...values,
      bankAccountName: stripVietnameseDiacritics(values.bankAccountName).toUpperCase(),
      vaNumber: values.vaNumber?.trim() || '',
      transferPrefix: values.transferPrefix?.trim() || '',
    };
    await updateMutation.mutateAsync({ key: 'store_invoice_bank', value: normalizedPayload });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Form cấu hình */}
      <Card className="lg:col-span-7">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode size={16} className="text-primary" /> Cấu hình Hoá đơn & Tài khoản VietQR
          </CardTitle>
          <CardDescription>
            Thiết lập thông tin cửa hàng hiển thị trên hoá đơn bán hàng và tài khoản ngân hàng dùng
            để tự động tạo mã VietQR & đối soát SePay Webhook.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoiceStoreName">Tên tiệm trên hoá đơn</Label>
                <Input
                  id="invoiceStoreName"
                  {...form.register('storeName')}
                  placeholder="SULLEY FLORAL STUDIO"
                />
                {form.formState.errors.storeName && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.storeName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoiceStorePhone">SĐT trên hoá đơn</Label>
                <Input
                  id="invoiceStorePhone"
                  {...form.register('storePhone')}
                  placeholder="034 908 1629"
                />
                {form.formState.errors.storePhone && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.storePhone.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ngân hàng nhận chuyển khoản (NAPAS BIN)</Label>
                <Controller
                  control={form.control}
                  name="bankBin"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(bin) => {
                        field.onChange(bin);
                        const bank = findVietnamBankByBin(bin);
                        if (bank) {
                          form.setValue('bankShortName', bank.shortName, { shouldDirty: true });
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn ngân hàng" />
                      </SelectTrigger>
                      <SelectContent className="max-h-72">
                        {VIETNAM_BANKS.map((bank) => (
                          <SelectItem key={bank.bin} value={bank.bin}>
                            {bank.shortName} ({bank.code}) - {bank.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Loại tài khoản ngân hàng</Label>
                <Controller
                  control={form.control}
                  name="bankAccountType"
                  render={({ field }) => (
                    <Select
                      value={field.value || 'BUSINESS_HOUSEHOLD'}
                      onValueChange={(val) => field.onChange(val as BankAccountType)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại tài khoản" />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(ACCOUNT_TYPE_LABELS) as BankAccountType[]).map((key) => (
                          <SelectItem key={key} value={key}>
                            {ACCOUNT_TYPE_LABELS[key]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {selectedBank?.sepayNote && (
              <div className="flex items-start gap-2.5 p-3 rounded-lg border border-border bg-muted/40 text-xs text-muted-foreground">
                {selectedBank.requiresVa || selectedBank.requiresSevqrPrefix ? (
                  <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <p className="font-medium text-foreground">
                    Lưu ý SePay cho {selectedBank.shortName} (BIN: {selectedBank.bin}):
                  </p>
                  <p>{selectedBank.sepayNote}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bankAccountNumber">Số tài khoản</Label>
                <Input
                  id="bankAccountNumber"
                  {...form.register('bankAccountNumber')}
                  placeholder="Nhập số tài khoản MBBank"
                />
                {form.formState.errors.bankAccountNumber && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.bankAccountNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankAccountName">Tên chủ tài khoản (tự chuẩn hóa không dấu)</Label>
                <Input
                  id="bankAccountName"
                  {...form.register('bankAccountName')}
                  placeholder="NGUYEN VAN A"
                />
                {form.formState.errors.bankAccountName && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.bankAccountName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vaNumber">Số Tài khoản Ảo / VA (tuỳ chọn)</Label>
                <Input
                  id="vaNumber"
                  {...form.register('vaNumber')}
                  placeholder="Để trống nếu nhận trực tiếp STK chính"
                />
                <p className="text-[11px] text-muted-foreground">
                  MBBank hộ kinh doanh cá nhân có thể để trống để dùng trực tiếp số tài khoản chính.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transferPrefix">Hậu tố mô tả thêm sau mã đơn (tuỳ chọn)</Label>
                <Input
                  id="transferPrefix"
                  {...form.register('transferPrefix')}
                  placeholder="Để trống để nội dung là ORD000001"
                />
                <p className="text-[11px] text-muted-foreground">
                  Nội dung mẫu:{' '}
                  <strong className="text-foreground">
                    {sampleTransferContent || 'ORD000001'}
                  </strong>
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoiceFooterText">Lời cảm ơn cuối hoá đơn</Label>
              <Input
                id="invoiceFooterText"
                {...form.register('footerText')}
                placeholder="Cảm ơn quý khách và hẹn gặp lại"
              />
              {form.formState.errors.footerText && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.footerText.message}
                </p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={updateMutation.isPending} className="cursor-pointer">
                {updateMutation.isPending ? (
                  <Loader2 className="animate-spin mr-2" size={14} />
                ) : (
                  <Save size={14} className="mr-2" />
                )}
                Lưu cấu hình Hoá đơn & Ngân hàng
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Live Mini Preview dùng chung component OrderReceipt */}
      <Card className="lg:col-span-5">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Eye size={15} className="text-primary" /> Xem trước mẫu Hoá đơn &amp; VietQR
          </CardTitle>
          <CardDescription className="text-xs">
            Dữ liệu minh hoạ đơn hàng <strong>ORD000001</strong> còn nợ <strong>270.000 đ</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center bg-muted/30 p-4 rounded-b-xl border-t border-border">
          <OrderReceipt
            order={SAMPLE_PREVIEW_ORDER}
            invoiceConfig={previewInvoiceConfig}
            enablePrintPortal={false}
          />
        </CardContent>
      </Card>
    </div>
  );
}
