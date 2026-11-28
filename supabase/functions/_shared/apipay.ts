export interface VerifyApiPaySignatureParams {
  rawBody: string;
  signatureHeader: string | null;
  secret: string;
}

export interface VerifyResult {
  ok: boolean;
  reason?: string;
}

const encoder = new TextEncoder();

/**
 * So sánh hai chuỗi theo thời gian hằng (constant-time) nhằm chống tấn công đo thời gian.
 */
export function constantTimeEqual(a: string, b: string): boolean {
  const bytesA = encoder.encode(a);
  const bytesB = encoder.encode(b);

  let diff = bytesA.length ^ bytesB.length;
  const maxLen = Math.max(bytesA.length, bytesB.length);
  for (let i = 0; i < maxLen; i += 1) {
    const byteA = i < bytesA.length ? bytesA[i] : 0;
    const byteB = i < bytesB.length ? bytesB[i] : 0;
    diff |= byteA ^ byteB;
  }

  return diff === 0;
}

/**
 * Xác thực chữ ký ApiPay-Signature: HMAC-SHA256 (hex) của raw request body.
 * Fail-closed: secret rỗng hoặc header thiếu/sai định dạng luôn trả về false.
 */
export async function verifyApiPaySignature({
  rawBody,
  signatureHeader,
  secret,
}: VerifyApiPaySignatureParams): Promise<VerifyResult> {
  const cleanSecret = (secret || '').trim();
  if (!cleanSecret) {
    return { ok: false, reason: 'missing_secret' };
  }

  const receivedHex = (signatureHeader || '').trim().toLowerCase();
  if (!/^[0-9a-f]{64}$/.test(receivedHex)) {
    return { ok: false, reason: 'invalid_signature_format' };
  }

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(cleanSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const signedBuffer = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(rawBody));

  const expectedHex = Array.from(new Uint8Array(signedBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  if (!constantTimeEqual(expectedHex, receivedHex)) {
    return { ok: false, reason: 'signature_mismatch' };
  }

  return { ok: true };
}

/**
 * Tạo header Authorization theo chuẩn ApiPay: Bearer base64(accessKey:secretKey).
 */
export function buildApiPayAuthHeader(accessKey: string, secretKey: string): string {
  const raw = `${accessKey.trim()}:${secretKey.trim()}`;
  const bytes = encoder.encode(raw);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return `Bearer ${btoa(binary)}`;
}

/**
 * Trích xuất mã đơn hàng dạng ORD000001 từ nội dung chuyển khoản (ApiPay trả nguyên văn content).
 * Hỗ trợ trường hợp ngân hàng chèn chữ trước/sau, thêm tiền tố COC (COCORD000001 / COC ORD000001)
 * hoặc khách gõ thêm dấu '-' / khoảng trắng (VD: ORD-000001).
 */
export function extractOrderPaymentCode(content?: string | null): string | null {
  if (!content || typeof content !== 'string') return null;

  const match = content.match(
    /(?:^|[^A-Za-z0-9](?:COC)?|^COC)[-\s]?(ORD)[-\s]?(\d{6,8})(?=$|[^A-Za-z0-9])/i,
  );
  if (!match) return null;

  return `ORD${match[2]}`;
}

/**
 * Kiểm tra nội dung chuyển khoản có mang từ khoá đặt cọc (COC) hay không.
 */
export function hasDepositKeyword(content?: string | null): boolean {
  if (!content || typeof content !== 'string') return false;
  return /(^|[^A-Za-z0-9])COC([^A-Za-z0-9]|$|ORD\d{6,8})/i.test(content);
}

/**
 * Chuẩn hóa timestamp ISO-8601 từ ApiPay (fallback về thời điểm hiện tại nếu thiếu).
 */
export function toIsoTimestamp(dateStr?: string | null): string {
  const raw = (dateStr || '').trim();
  if (raw) {
    const parsed = new Date(raw);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }
  return new Date().toISOString();
}

/**
 * Che số tài khoản chỉ giữ 4 ký tự cuối khi ghi log hệ thống (bảo mật dữ liệu cá nhân).
 */
export function maskAccountLast4(account?: string | null): string {
  const clean = (account || '').replace(/\s+/g, '');
  if (clean.length <= 4) return '****';
  return `****${clean.slice(-4)}`;
}

/**
 * Chuẩn hóa số tài khoản kỳ vọng từ cấu hình store_invoice_bank (ưu tiên VA nếu có).
 */
export function normalizeExpectedAccount(
  configValue?: { vaNumber?: string; bankAccountNumber?: string } | null,
): string {
  const raw = (configValue?.vaNumber || configValue?.bankAccountNumber || '').trim();
  return raw.replace(/[^a-zA-Z0-9]/g, '');
}
