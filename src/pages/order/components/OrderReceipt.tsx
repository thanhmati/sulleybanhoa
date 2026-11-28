import { type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle2 } from 'lucide-react';
import type { Order } from '@/types/order';
import type { StoreInvoiceBankConfig } from '@/types/store-setting';
import { DEFAULT_STORE_INVOICE_BANK } from '@/services/storeSettingService';
import { formatDate } from '@/lib/utils/formatters';
import {
  buildOrderTransferContent,
  formatOrderPaymentCode,
  generateVietQRPayload,
  stripVietnameseDiacritics,
} from '@/lib/utils/vietqr';

export type ReceiptMode = 'sale' | 'deposit';

interface OrderReceiptProps {
  order: Order;
  invoiceConfig?: StoreInvoiceBankConfig;
  captureRef?: RefObject<HTMLDivElement | null>;
  enablePrintPortal?: boolean;
  mode?: ReceiptMode;
  depositAmountOverride?: number;
}

function formatVndPlain(value: number): string {
  return new Intl.NumberFormat('vi-VN').format(Math.round(value));
}

function formatVndLabel(value: number): string {
  return `${formatVndPlain(value)} đ`;
}

export function OrderReceipt({
  order,
  invoiceConfig,
  captureRef,
  enablePrintPortal = true,
  mode = 'sale',
  depositAmountOverride,
}: OrderReceiptProps) {
  const config = invoiceConfig || DEFAULT_STORE_INVOICE_BANK;

  const productPrice = Math.max(0, Number(order.price || 0));
  const shipFee = Math.max(0, Number(order.ship || 0));
  const deposit = Math.max(0, Number(order.deposit || 0));
  const totalAmount = productPrice + shipFee;
  const dueAmount = Math.max(0, Number(order.dueAmount ?? totalAmount - deposit));

  const paidFromTransactions = Array.isArray(order.transaction)
    ? order.transaction.reduce((sum, tx) => sum + Number(tx.amount || 0), 0)
    : Math.max(0, totalAmount - deposit - dueAmount);

  const isDepositMode = mode === 'deposit';
  const configuredDeposit = Math.max(
    0,
    Math.round(
      Number(
        config.defaultDepositAmount ?? DEFAULT_STORE_INVOICE_BANK.defaultDepositAmount ?? 200000,
      ),
    ),
  );
  const autoDepositAmount =
    dueAmount <= 0 || order.isPaid
      ? 0
      : deposit > 0
        ? 0
        : Math.min(configuredDeposit > 0 ? configuredDeposit : 200000, dueAmount);

  const rawRequestedDeposit =
    depositAmountOverride !== undefined && Number.isFinite(depositAmountOverride)
      ? Math.max(0, Math.round(depositAmountOverride))
      : autoDepositAmount;

  const depositRequestAmount = isDepositMode ? Math.min(rawRequestedDeposit, dueAmount) : 0;
  const remainingAfterDeposit = Math.max(0, dueAmount - depositRequestAmount);
  const qrAmount = isDepositMode ? depositRequestAmount : dueAmount;

  const paymentCode = formatOrderPaymentCode(order.orderNumber, order.id);
  const receivingAccount = (config.vaNumber || config.bankAccountNumber || '').trim();
  const transferContent = buildOrderTransferContent({
    orderNumber: order.orderNumber,
    fallbackId: order.id,
    transferPrefix: config.transferPrefix,
    bankBin: config.bankBin,
    isDeposit: isDepositMode,
  });

  const qrPayload =
    qrAmount > 0 && config.bankBin && receivingAccount
      ? generateVietQRPayload({
          bankBin: config.bankBin,
          accountNumber: receivingAccount,
          amount: qrAmount,
          description: transferContent,
        })
      : '';

  const productLabel = [order.type, order.tone].filter(Boolean).join(' - ') || 'Sản phẩm hoa tươi';
  const accountHolderDisplay = config.bankAccountName
    ? stripVietnameseDiacritics(config.bankAccountName).toUpperCase()
    : '';

  const receiptContent = (
    <div className="flex flex-col text-[#18181b]">
      {/* Header cửa hàng */}
      <div className="text-center pb-2.5 border-b border-[#d4d4d8]">
        <h1 className="text-[14px] font-semibold tracking-tight text-[#18181b]">
          {config.storeName || DEFAULT_STORE_INVOICE_BANK.storeName}
        </h1>
        {config.storePhone && (
          <p className="text-[11px] text-[#3f3f46] mt-0.5">{config.storePhone}</p>
        )}
      </div>

      {/* Tiêu đề & Mã đơn (không mã vạch) */}
      <div className="text-center py-2.5 border-b border-[#d4d4d8] space-y-0.5">
        <h2 className="font-bold text-[12px] uppercase tracking-wide text-[#18181b]">
          {isDepositMode ? 'HÓA ĐƠN ĐẶT CỌC' : 'HÓA ĐƠN BÁN HÀNG'}
        </h2>
        <p className="text-[11px] text-[#27272a]">
          {paymentCode} - {formatDate(order.createdAt || new Date(), 'DD/MM/YY HH:mm')}
        </p>
      </div>

      {/* Thông tin khách hàng tối giản */}
      <div className="flex items-baseline justify-between gap-4 py-2 border-b border-[#d4d4d8] text-[11px]">
        <span className="text-[#3f3f46] shrink-0">Khách:</span>
        <span className="font-semibold text-right text-[#18181b] break-words">
          {order.client?.name || 'Khách lẻ'}
        </span>
      </div>

      {/* Bảng sản phẩm: Đơn giá | SL | T.tiền */}
      <div className="py-2 border-b border-[#d4d4d8] space-y-1.5 text-[11px]">
        <div className="grid grid-cols-12 font-semibold text-[10px] text-[#18181b]">
          <span className="col-span-6">Đơn giá</span>
          <span className="col-span-2 text-center">SL</span>
          <span className="col-span-4 text-right">T.tiền</span>
        </div>

        <div className="space-y-0.5">
          <p className="text-[#18181b] break-words">1. {productLabel}</p>
          <div className="grid grid-cols-12 text-[#18181b] tabular-nums">
            <span className="col-span-6">{formatVndPlain(productPrice)}</span>
            <span className="col-span-2 text-center">x1</span>
            <span className="col-span-4 text-right">{formatVndPlain(productPrice)}</span>
          </div>
        </div>
      </div>

      {/* Tổng kết tiền hàng, cọc & công nợ */}
      <div className="py-2 border-b border-[#d4d4d8] space-y-1 text-[11px] tabular-nums">
        <div className="flex justify-between">
          <span className="text-[#27272a]">Tạm tính</span>
          <span className="font-semibold">{formatVndLabel(productPrice)}</span>
        </div>

        {shipFee > 0 && (
          <div className="flex justify-between">
            <span className="text-[#27272a]">Vận chuyển</span>
            <span className="font-semibold">{formatVndLabel(shipFee)}</span>
          </div>
        )}

        {isDepositMode ? (
          <>
            <div className="flex justify-between">
              <span className="text-[#27272a]">Tổng cộng</span>
              <span className="font-semibold text-[#18181b]">{formatVndLabel(totalAmount)}</span>
            </div>

            {deposit > 0 && (
              <div className="flex justify-between">
                <span className="text-[#27272a]">Đã đặt cọc</span>
                <span className="font-semibold">{formatVndLabel(deposit)}</span>
              </div>
            )}

            {paidFromTransactions > 0 && (
              <div className="flex justify-between">
                <span className="text-[#27272a]">Đã thanh toán</span>
                <span className="font-semibold">{formatVndLabel(paidFromTransactions)}</span>
              </div>
            )}

            {depositRequestAmount > 0 ? (
              <>
                <div className="flex justify-between font-bold text-[12px]">
                  <span className="text-[#18181b]">Cần đặt cọc</span>
                  <span className="text-[#d99b26]">{formatVndLabel(depositRequestAmount)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#27272a]">Còn lại sau cọc</span>
                  <span className="font-semibold text-[#18181b]">
                    {formatVndLabel(remainingAfterDeposit)}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex justify-between">
                <span className="text-[#27272a]">Còn lại</span>
                <span className="font-semibold text-[#18181b]">{formatVndLabel(dueAmount)}</span>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex justify-between font-bold text-[12px]">
              <span className="text-[#18181b]">Tổng cộng</span>
              <span className="text-[#d99b26]">{formatVndLabel(totalAmount)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#27272a]">Tiền cọc</span>
              <span className="font-semibold">{formatVndLabel(deposit)}</span>
            </div>

            {paidFromTransactions > 0 && (
              <div className="flex justify-between">
                <span className="text-[#27272a]">Đã thanh toán</span>
                <span className="font-semibold">{formatVndLabel(paidFromTransactions)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-[#27272a]">Còn lại</span>
              <span className="font-semibold text-[#18181b]">{formatVndLabel(dueAmount)}</span>
            </div>
          </>
        )}
      </div>

      {/* Khối thông tin chuyển khoản VietQR hoặc trạng thái Đã thanh toán / Đã nhận cọc */}
      <div className="py-2.5 border-b border-[#d4d4d8]">
        {dueAmount <= 0 || order.isPaid ? (
          <div className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded border border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d] text-[11px] font-semibold">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>ĐÃ THANH TOÁN ĐỦ</span>
          </div>
        ) : isDepositMode && qrAmount <= 0 ? (
          <div className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded border border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d] text-[11px] font-semibold">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>ĐÃ NHẬN ĐẶT CỌC</span>
          </div>
        ) : qrPayload ? (
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col items-center shrink-0">
                <span className="text-[10px] font-extrabold tracking-tight leading-none mb-1">
                  <span className="text-[#dc2626]">V</span>
                  <span className="text-[#1d4ed8]">IETQR</span>
                </span>
                <QRCodeSVG
                  value={qrPayload}
                  size={92}
                  level="M"
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
              </div>

              <div className="text-right text-[10.5px] leading-snug space-y-0.5 pt-4 min-w-0">
                <p className="font-semibold text-[#18181b]">{config.bankShortName}</p>
                {accountHolderDisplay && (
                  <p className="font-medium text-[#18181b] uppercase break-words">
                    {accountHolderDisplay}
                  </p>
                )}
                <p className="font-semibold text-[#18181b] tabular-nums">{receivingAccount}</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 text-[10.5px] mt-2">
              <span className="text-[#3f3f46]">Nội dung</span>
              <span className="font-semibold text-[#18181b]">{transferContent}</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-3 px-2 rounded border border-dashed border-[#d4d4d8] text-[10px] text-[#71717a]">
            Chưa cấu hình tài khoản ngân hàng trong mục Cấu hình cửa hàng → Hoá đơn &amp; Ngân hàng.
          </div>
        )}
      </div>

      {/* Footer cảm ơn */}
      <div className="text-center pt-2.5">
        <p className="text-[11px] font-medium text-[#18181b]">
          {config.footerText || DEFAULT_STORE_INVOICE_BANK.footerText}
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Screen preview & export target (isolated hex colors for Light/Dark & PNG export) */}
      <div
        ref={captureRef}
        id={enablePrintPortal ? 'receipt-capture' : undefined}
        className="w-[320px] h-fit shrink-0 bg-white text-[#18181b] p-4 rounded-sm border border-[#e4e4e7] shadow-xs print:hidden"
        style={{ fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif' }}
      >
        {receiptContent}
      </div>

      {/* Print target portaled directly into document.body (75mm thermal receipt) */}
      {enablePrintPortal &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            id="printable-receipt"
            className="hidden print:block w-[75mm] max-w-[75mm] p-[3mm_4mm] bg-white text-black box-border"
            style={{
              fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            <style>{`
              @media print {
                @page {
                  size: 75mm auto;
                  margin: 0;
                }
                html, body {
                  width: 75mm !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  background: white !important;
                  color: black !important;
                }
                #root, [data-slot="dialog-portal"] {
                  display: none !important;
                }
                body * {
                  visibility: hidden !important;
                }
                #printable-receipt,
                #printable-receipt * {
                  visibility: visible !important;
                }
                #printable-receipt {
                  display: block !important;
                  position: fixed !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: 75mm !important;
                  max-width: 75mm !important;
                  margin: 0 !important;
                  padding: 3mm 4mm !important;
                  background: white !important;
                  color: black !important;
                  box-sizing: border-box !important;
                  z-index: 9999999 !important;
                }
              }
            `}</style>
            {receiptContent}
          </div>,
          document.body,
        )}
    </>
  );
}
