import { Order } from '@/types/order';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';

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

  return (
    <div
      id="printable-receipt"
      className="w-full max-w-[300px] mx-auto bg-white text-zinc-900 p-4 font-mono text-xs leading-snug border border-zinc-200 rounded-sm shadow-xs print:shadow-none print:border-none print:p-0 print:m-0 print:w-[76mm] print:max-w-none print:text-black"
    >
      {/* CSS print override */}
      <style>{`
        @media print {
          @page {
            size: 80mm auto;
            margin: 0;
          }
          html, body {
            height: auto !important;
            min-height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            color: black !important;
            overflow: visible !important;
          }
          /* Collapse root app background so it takes 0 height */
          #root {
            display: none !important;
          }
          /* Hide all other DOM elements */
          body * {
            visibility: hidden !important;
          }
          /* Show ONLY printable receipt and its contents */
          #printable-receipt,
          #printable-receipt * {
            visibility: visible !important;
          }
          /* Fixed positioning starting at exact top-left corner (0,0) */
          #printable-receipt {
            display: block !important;
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 76mm !important;
            max-width: 76mm !important;
            margin: 0 !important;
            padding: 3mm 4mm !important;
            background: white !important;
            color: black !important;
            box-sizing: border-box !important;
            z-index: 999999 !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
        }
      `}</style>

      {/* Header Branding */}
      <div className="text-center space-y-1 pb-2 border-b border-dashed border-zinc-400">
        <h1 className="text-base font-extrabold uppercase tracking-wider font-serif text-zinc-900 print:text-black">
          Sulley Bán Hoa
        </h1>
        <p className="text-[10px] text-zinc-600 print:text-black italic">
          Hoa tươi phong cách Hàn Quốc
        </p>
      </div>

      {/* Receipt Title & Meta */}
      <div className="text-center py-2 border-b border-dashed border-zinc-400 space-y-0.5">
        <h2 className="font-bold text-sm uppercase tracking-wide">HÓA ĐƠN BÁN HÀNG</h2>
        <p className="text-[11px] font-semibold">
          Mã đơn: #{order.orderNumber || order.id?.slice(0, 8)}
        </p>
        <p className="text-[10px] text-zinc-500 print:text-black">
          Ngày tạo: {formatDate(order.createdAt || new Date(), 'DD/MM/YYYY HH:mm')}
        </p>
      </div>

      {/* Delivery & Client Info */}
      <div className="py-2 border-b border-dashed border-zinc-400 space-y-1">
        <div className="flex justify-between">
          <span className="font-semibold">Ngày giao:</span>
          <span>{formatDate(order.deliveryDate, 'DD/MM/YYYY')}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Giờ giao:</span>
          <span>{order.deliveryTime || 'Trong ngày'}</span>
        </div>
        <div className="pt-1 border-t border-dotted border-zinc-300">
          <span className="font-semibold block">Khách hàng:</span>
          <p className="font-bold text-zinc-900 print:text-black">
            {order.client?.name || 'Khách lẻ'}
          </p>
          {order.client?.phoneNumber && (
            <p className="text-[11px] text-zinc-700 print:text-black">
              SĐT: {order.client.phoneNumber}
            </p>
          )}
        </div>
        <div className="pt-1">
          <span className="font-semibold block">Địa chỉ giao:</span>
          <p className="text-[11px] text-zinc-800 print:text-black leading-tight break-words">
            {order.address || 'Tại tiệm'}
          </p>
        </div>
      </div>

      {/* Product Info */}
      <div className="py-2 border-b border-dashed border-zinc-400 space-y-1">
        <div className="flex justify-between">
          <span className="font-semibold">Sản phẩm:</span>
          <span className="font-bold">{order.type}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Tone màu:</span>
          <span>{order.tone}</span>
        </div>

        {order.note && (
          <div className="mt-1 p-1.5 bg-zinc-100 print:bg-zinc-100 rounded border border-zinc-300 print:border-black">
            <span className="font-bold text-[10px] block uppercase">Ghi chú đơn hàng:</span>
            <p className="text-[11px] font-medium leading-normal whitespace-pre-wrap">
              {order.note}
            </p>
          </div>
        )}
      </div>

      {/* Financial Breakdown */}
      <div className="py-2 border-b border-dashed border-zinc-400 space-y-1">
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

        <div className="flex justify-between pt-1 border-t border-dotted border-zinc-300 font-bold text-sm">
          <span>Tổng thành tiền:</span>
          <span>{formatCurrency(totalAmount)}</span>
        </div>

        <div className="flex justify-between text-[11px]">
          <span>Đã thanh toán:</span>
          <span className="font-semibold">{formatCurrency(paidAmount)}</span>
        </div>
      </div>

      {/* Outstanding Balance Banner */}
      <div className="py-2 text-center">
        {dueAmount > 0 ? (
          <div className="p-2 border-2 border-dashed border-zinc-900 print:border-black rounded bg-zinc-50 print:bg-white text-zinc-900 print:text-black">
            <p className="text-[10px] font-bold uppercase tracking-wider">CẦN THU HỒI TỪ KHÁCH</p>
            <p className="text-base font-extrabold tracking-tight">{formatCurrency(dueAmount)}</p>
          </div>
        ) : (
          <div className="p-1.5 bg-zinc-100 print:bg-zinc-100 rounded text-center">
            <p className="text-[11px] font-bold uppercase tracking-wide">ĐÃ THANH TOÁN 100%</p>
          </div>
        )}
      </div>

      {/* Footer Thank You */}
      <div className="text-center pt-2 border-t border-dashed border-zinc-400 space-y-1">
        <p className="text-[10px] font-medium italic">
          Cảm ơn quý khách đã tin tưởng và lựa chọn Sulley Bán Hoa! 🌸
        </p>
        <p className="text-[9px] text-zinc-500 print:text-black">Hotline / Zalo hỗ trợ đơn hàng</p>
      </div>
    </div>
  );
}
