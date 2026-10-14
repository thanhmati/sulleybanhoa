import dayjs from 'dayjs';
import { Order } from '@/types/order';
import { IFlowerType } from '@/types/catalog-metadata';
import { ORDER_STATUS } from '@/lib/constants/order.constant';

export interface FlowerImportOrderItem {
  id: string;
  orderNumber: string;
  clientName: string;
  type: string;
  deliveryDate: string;
  deliveryTime: string;
}

export interface FlowerImportItem {
  flowerName: string;
  leadDays: number;
  bouquetCount: number;
  orders: FlowerImportOrderItem[];
}

export interface FlowerImportPlan {
  targetDate: string;
  totalFlowerTypes: number;
  totalBouquets: number;
  items: FlowerImportItem[];
}

/**
 * Tính toán danh sách các loại hoa cần nhập vào một ngày cụ thể (targetDate).
 * Ngày cần nhập của hoa = Ngày giao đơn hàng - Số ngày cần nhập trước (leadDays).
 */
export function calculateFlowerImportPlan(
  orders: Order[],
  flowerTypes: IFlowerType[],
  targetDateInput?: string | Date,
): FlowerImportPlan {
  const targetDateStr = targetDateInput
    ? dayjs(targetDateInput).format('YYYY-MM-DD')
    : dayjs().format('YYYY-MM-DD');

  // Tạo map tra cứu loại hoa (tra cứu cả id và tên lowercase)
  const flowerMap = new Map<string, IFlowerType>();
  flowerTypes.forEach((ft) => {
    flowerMap.set(ft.id, ft);
    flowerMap.set(ft.name.toLowerCase().trim(), ft);
  });

  // Map tổng hợp theo tên hoa
  const summaryMap = new Map<
    string,
    {
      flowerName: string;
      leadDays: number;
      ordersMap: Map<string, FlowerImportOrderItem>;
    }
  >();

  // Duyệt qua tất cả đơn hàng (loại trừ đơn đã HỦY)
  orders.forEach((order) => {
    if (order.status === ORDER_STATUS.CANCELLED) return;
    if (!order.deliveryDate) return;

    const deliveryDateStr = dayjs(order.deliveryDate).format('YYYY-MM-DD');
    const flowers = order.flowers || [];

    if (flowers.length === 0) return;

    // Loại bỏ trùng lặp hoa trong cùng 1 đơn hàng (nếu có)
    const uniqueFlowersInOrder = Array.from(new Set(flowers));

    uniqueFlowersInOrder.forEach((flowerRaw) => {
      const trimmed = flowerRaw.trim();
      if (!trimmed) return;

      const ft = flowerMap.get(trimmed) || flowerMap.get(trimmed.toLowerCase());
      const flowerName = ft ? ft.name : trimmed;
      const leadDays = ft?.leadDays ?? 0;

      // Tính ngày cần nhập: DeliveryDate - leadDays
      const importDateStr = dayjs(deliveryDateStr).subtract(leadDays, 'day').format('YYYY-MM-DD');

      // Nếu ngày cần nhập trùng với targetDate đang xem
      if (importDateStr === targetDateStr) {
        if (!summaryMap.has(flowerName)) {
          summaryMap.set(flowerName, {
            flowerName,
            leadDays,
            ordersMap: new Map(),
          });
        }

        const entry = summaryMap.get(flowerName)!;
        entry.ordersMap.set(order.id, {
          id: order.id,
          orderNumber: order.orderNumber || 'Chưa có mã',
          clientName: order.client?.name || 'Khách lẻ',
          type: order.type || 'Bó hoa',
          deliveryDate: deliveryDateStr,
          deliveryTime: order.deliveryTime || '',
        });
      }
    });
  });

  // Chuyển summaryMap thành danh sách items
  const items: FlowerImportItem[] = Array.from(summaryMap.values())
    .map((entry) => ({
      flowerName: entry.flowerName,
      leadDays: entry.leadDays,
      bouquetCount: entry.ordersMap.size,
      orders: Array.from(entry.ordersMap.values()),
    }))
    .sort((a, b) => b.bouquetCount - a.bouquetCount || a.flowerName.localeCompare(b.flowerName));

  const totalBouquets = items.reduce((sum, item) => sum + item.bouquetCount, 0);

  return {
    targetDate: targetDateStr,
    totalFlowerTypes: items.length,
    totalBouquets,
    items,
  };
}

/**
 * Tạo văn bản tóm tắt kế hoạch nhập hoa để gửi tin nhắn / Zalo
 */
export function generateFlowerImportText(plan: FlowerImportPlan): string {
  const formattedDate = dayjs(plan.targetDate).format('DD/MM/YYYY');
  const lines: string[] = [];

  lines.push(`🌸 KẾ HOẠCH NHẬP HOA - NGÀY ${formattedDate}`);
  lines.push(`Tiệm hoa: Sulley Bán Hoa`);
  lines.push(`----------------------------------------`);

  if (plan.items.length === 0) {
    lines.push(`Không có loại hoa nào cần nhập vào ngày ${formattedDate}.`);
  } else {
    plan.items.forEach((item, index) => {
      const ordersDesc = item.orders
        .map((o) => `#${o.orderNumber} (giao ${dayjs(o.deliveryDate).format('DD/MM')})`)
        .join(', ');

      const leadNote =
        item.leadDays > 0 ? `[Nhập trước ${item.leadDays} ngày]` : `[Nhập trong ngày]`;

      lines.push(`${index + 1}. ${item.flowerName}: Dùng cho ${item.bouquetCount} bó ${leadNote}`);
      lines.push(`   └ Các đơn: ${ordersDesc}`);
    });
  }

  lines.push(`----------------------------------------`);
  lines.push(`Tổng cộng: ${plan.totalFlowerTypes} loại hoa | Dùng cho ${plan.totalBouquets} bó`);
  lines.push(`Thời gian tạo: ${dayjs().format('HH:mm DD/MM/YYYY')}`);

  return lines.join('\n');
}
