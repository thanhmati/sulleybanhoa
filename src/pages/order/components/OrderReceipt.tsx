import { createPortal } from 'react-dom';
import { Order } from '@/types/order';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { CONTACT } from '@/lib/constants/contact.constant';

interface OrderReceiptProps {
  order: Order;
}

export function OrderReceipt({ order }: OrderReceiptProps) {
  const totalPrice = Number(order.price || 0);
  const shipFee = Number(order.ship || 0);
  const deposit = Number(order.deposit || 0);
  const totalAmount = totalPrice + shipFee;
  const dueAmount = Number(order.dueAmount || 0);
  const paidAmount = Math.max(0, totalAmount - dueAmount);

  const receiptContent = (
    <>
      {/* Header Branding */}
      <div className="text-center space-y-0.5 pb-1.5 border-b border-dashed border-zinc-400">
        <h1 className="text-sm font-extrabold uppercase tracking-wider font-serif text-zinc-900 print:text-black">
          SULLEY FLORAL STUDIO
        </h1>
        <p className="text-[9px] text-zinc-600 print:text-black italic">
          Hotline: {CONTACT.INFO.phoneNumber}
        </p>
      </div>

      {/* Receipt Title & Meta */}
      <div className="text-center py-1.5 border-b border-dashed border-zinc-400 space-y-0.5">
        <h2 className="font-bold text-xs uppercase tracking-wide">HÓA ĐƠN BÁN HÀNG</h2>
        <p className="text-[10px] font-semibold">
          Mã đơn: #{order.orderNumber || order.id?.slice(0, 8)}
        </p>
        <p className="text-[9px] text-zinc-500 print:text-black">
          Ngày tạo: {formatDate(order.createdAt || new Date(), 'DD/MM/YYYY HH:mm')}
        </p>
      </div>

      {/* Delivery & Client Info */}
      <div className="py-1.5 border-b border-dashed border-zinc-400 space-y-0.5">
        <div className="flex justify-between">
          <span className="font-semibold">Ngày giao:</span>
          <span>{formatDate(order.deliveryDate, 'DD/MM/YYYY')}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Giờ giao:</span>
          <span>{order.deliveryTime || 'Trong ngày'}</span>
        </div>
        <div className="pt-0.5 border-t border-dotted border-zinc-300">
          <span className="font-semibold block">Khách hàng:</span>
          <p className="font-bold text-zinc-900 print:text-black">
            {order.client?.name || 'Khách lẻ'}
          </p>
          {order.client?.phoneNumber && (
            <p className="text-[10px] text-zinc-700 print:text-black">
              SĐT: {order.client.phoneNumber}
            </p>
          )}
        </div>
        <div className="pt-0.5">
          <span className="font-semibold block">Địa chỉ giao:</span>
          <p className="text-[10px] text-zinc-800 print:text-black leading-tight break-words">
            {order.address || 'Tại tiệm'}
          </p>
        </div>
      </div>

      {/* Product Info */}
      <div className="py-1.5 border-b border-dashed border-zinc-400 space-y-0.5">
        <div className="flex justify-between">
          <span className="font-semibold">Sản phẩm:</span>
          <span className="font-bold">{order.type}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Tone màu:</span>
          <span>{order.tone}</span>
        </div>

        {order.note && (
          <div className="mt-1 p-1 bg-zinc-100 print:bg-zinc-100 rounded border border-zinc-300 print:border-black">
            <span className="font-bold text-[9px] block uppercase">Ghi chú đơn hàng:</span>
            <p className="text-[10px] font-medium leading-tight whitespace-pre-wrap">
              {order.note}
            </p>
          </div>
        )}
      </div>

      {/* Financial Breakdown */}
      <div className="py-1.5 border-b border-dashed border-zinc-400 space-y-0.5">
        <div className="flex justify-between">
          <span>Giá sản phẩm:</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
        {shipFee > 0 && (
          <div className="flex justify-between">
            <span>Phí giao hàng:</span>
            <span>{formatCurrency(shipFee)}</span>
          </div>
        )}
        {deposit > 0 && (
          <div className="flex justify-between">
            <span>Tiền cọc:</span>
            <span>{formatCurrency(deposit)}</span>
          </div>
        )}

        <div className="flex justify-between pt-0.5 border-t border-dotted border-zinc-300 font-bold text-xs">
          <span>Tổng thành tiền:</span>
          <span>{formatCurrency(totalAmount)}</span>
        </div>

        <div className="flex justify-between text-[10px]">
          <span>Đã thanh toán:</span>
          <span className="font-semibold">{formatCurrency(paidAmount)}</span>
        </div>
      </div>

      {/* Footer Thank You */}
      <div className="text-center pt-1.5 space-y-0.5">
        <p className="text-[9px] font-medium italic">
          Cảm ơn quý khách đã tin tưởng và lựa chọn Sulley Bán Hoa! 🌸
        </p>
      </div>
    </>
  );

  return (
    <>
      {/* Screen preview inside Dialog Modal */}
      <div className="w-full max-w-[75mm] min-h-[125mm] mx-auto bg-white text-zinc-900 p-3 font-mono text-[10px] leading-snug border border-zinc-200 rounded-sm shadow-xs print:hidden flex flex-col justify-between">
        {receiptContent}
      </div>

      {/* Print target portaled directly into document.body */}
      {typeof document !== 'undefined' &&
        createPortal(
          <div
            id="printable-receipt"
            className="hidden print:flex flex-col justify-between w-[75mm] max-w-[75mm] h-[125mm] max-h-[125mm] p-[3mm_4mm] bg-white text-black font-mono text-[10px] leading-snug box-border"
          >
            <style>{`
              @media print {
                @page {
                  size: 75mm 125mm;
                  margin: 0;
                }
                html, body {
                  width: 75mm !important;
                  height: 125mm !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  background: white !important;
                  color: black !important;
                  overflow: hidden !important;
                }
                /* Hide screen application roots */
                #root, [data-slot="dialog-portal"] {
                  display: none !important;
                }
                /* Hide everything except printable receipt */
                body * {
                  visibility: hidden !important;
                }
                #printable-receipt,
                #printable-receipt * {
                  visibility: visible !important;
                }
                #printable-receipt {
                  display: flex !important;
                  flex-direction: column !important;
                  justify-content: space-between !important;
                  position: fixed !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: 75mm !important;
                  max-width: 75mm !important;
                  height: 125mm !important;
                  max-height: 125mm !important;
                  margin: 0 !important;
                  padding: 3mm 4mm !important;
                  background: white !important;
                  color: black !important;
                  box-sizing: border-box !important;
                  z-index: 9999999 !important;
                  overflow: hidden !important;
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
