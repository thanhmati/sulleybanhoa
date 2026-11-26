export interface IVietQRPayloadParams {
  bankBin: string;
  accountNumber: string;
  amount?: number;
  description?: string;
}

export interface ITransferContentParams {
  orderNumber?: string;
  fallbackId?: string;
  transferPrefix?: string;
  bankBin?: string;
}

/**
 * Loại bỏ dấu tiếng Việt và chuẩn hóa về ký tự ASCII an toàn cho nội dung chuyển khoản / VietQR.
 */
export function stripVietnameseDiacritics(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Chuẩn hóa mã đơn hàng thành mã thanh toán không dấu gạch ngang (VD: ORD-000001 -> ORD000001).
 */
export function formatOrderPaymentCode(orderNumber?: string, fallbackId?: string): string {
  const raw = (orderNumber || '').trim();
  if (raw) {
    const cleaned = raw.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (cleaned) return cleaned;
  }

  if (fallbackId) {
    return fallbackId
      .replace(/[^a-zA-Z0-9]/g, '')
      .slice(0, 8)
      .toUpperCase();
  }

  return '';
}

/**
 * Tạo nội dung chuyển khoản tự động đặt mã thanh toán lên đầu,
 * đảm bảo không bị ngân hàng trung gian cắt mất mã đơn để ApiPay đối soát chính xác.
 */
export function buildOrderTransferContent({
  orderNumber,
  fallbackId,
  transferPrefix,
}: ITransferContentParams): string {
  const paymentCode = formatOrderPaymentCode(orderNumber, fallbackId);
  const sanitizedPrefix = transferPrefix
    ? stripVietnameseDiacritics(transferPrefix)
        .replace(/[^a-zA-Z0-9 -]/g, '')
        .trim()
    : '';

  const finalMemo = sanitizedPrefix ? `${paymentCode} ${sanitizedPrefix}`.trim() : paymentCode;
  return finalMemo.slice(0, 50).trim();
}

function tlv(tag: string, value: string): string {
  const length = value.length.toString().padStart(2, '0');
  return `${tag}${length}${value}`;
}

/**
 * Tính checksum CRC16-CCITT (polynomial 0x1021, initial value 0xFFFF) theo chuẩn EMVCo.
 */
export function computeCRC16CCITT(input: string): string {
  let crc = 0xffff;
  for (let i = 0; i < input.length; i += 1) {
    crc ^= input.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Sinh chuỗi payload QR chuẩn EMVCo VietQR (NAPAS 247 IBFT - QRIBFTTA).
 * Tự động thiết lập Tag 01 = "12" (Dynamic QR) khi có số tiền > 0 để app ngân hàng điền sẵn & khóa số tiền.
 */
export function generateVietQRPayload({
  bankBin,
  accountNumber,
  amount,
  description,
}: IVietQRPayloadParams): string {
  const cleanBin = bankBin.replace(/\D/g, '');
  const cleanAccount = accountNumber.replace(/[^a-zA-Z0-9]/g, '');

  if (!cleanBin || !cleanAccount) {
    return '';
  }

  const normalizedAmount =
    typeof amount === 'number' && Number.isFinite(amount) && amount > 0 ? Math.round(amount) : 0;

  const cleanDescription = description
    ? stripVietnameseDiacritics(description)
        .replace(/[^a-zA-Z0-9 -]/g, '')
        .slice(0, 50)
        .trim()
    : '';

  // Tag 38: Merchant Account Information (NAPAS 247)
  const beneficiaryOrg = tlv('00', cleanBin) + tlv('01', cleanAccount);
  const merchantAccountInfo =
    tlv('00', 'A000000727') + tlv('01', beneficiaryOrg) + tlv('02', 'QRIBFTTA');

  const segments: string[] = [
    tlv('00', '01'),
    tlv('01', normalizedAmount > 0 ? '12' : '11'),
    tlv('38', merchantAccountInfo),
    tlv('53', '704'),
  ];

  if (normalizedAmount > 0) {
    segments.push(tlv('54', String(normalizedAmount)));
  }

  segments.push(tlv('58', 'VN'));

  if (cleanDescription) {
    segments.push(tlv('62', tlv('08', cleanDescription)));
  }

  const payloadWithoutCrc = `${segments.join('')}6304`;
  const crc = computeCRC16CCITT(payloadWithoutCrc);
  return `${payloadWithoutCrc}${crc}`;
}
