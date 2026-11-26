export interface VerifyHmacParams {
  rawBody: string;
  signatureHeader: string | null;
  timestampHeader: string | null;
  secret: string;
  nowSeconds?: number;
  maxSkewSeconds?: number;
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
 * Xác thực chữ ký HMAC-SHA256 của SePay trên raw body và timestamp chống replay (±5 phút).
 * Fail-closed: secret rỗng luôn trả về false.
 */
export async function verifySePayHmacSignature({
  rawBody,
  signatureHeader,
  timestampHeader,
  secret,
  nowSeconds = Math.floor(Date.now() / 1000),
  maxSkewSeconds = 300,
}: VerifyHmacParams): Promise<VerifyResult> {
  const cleanSecret = (secret || '').trim();
  if (!cleanSecret) {
    return { ok: false, reason: 'missing_secret' };
  }

  if (!signatureHeader || !timestampHeader) {
    return { ok: false, reason: 'missing_headers' };
  }

  const timestamp = Number(timestampHeader.trim());
  if (!Number.isFinite(timestamp) || timestamp <= 0) {
    return { ok: false, reason: 'invalid_timestamp' };
  }

  if (Math.abs(nowSeconds - timestamp) > maxSkewSeconds) {
    return { ok: false, reason: 'expired_timestamp' };
  }

  const trimmedSig = signatureHeader.trim();
  if (!trimmedSig.toLowerCase().startsWith('sha256=')) {
    return { ok: false, reason: 'invalid_signature_format' };
  }

  const receivedHex = trimmedSig.slice(7).toLowerCase();
  if (!/^[0-9a-f]{64}$/.test(receivedHex)) {
    return { ok: false, reason: 'invalid_signature_hex' };
  }

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(cleanSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const signedBuffer = await crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    encoder.encode(`${Math.trunc(timestamp)}.${rawBody}`),
  );

  const expectedHex = Array.from(new Uint8Array(signedBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  if (!constantTimeEqual(expectedHex, receivedHex)) {
    return { ok: false, reason: 'signature_mismatch' };
  }

  return { ok: true };
}

/**
 * Xác thực API Key header (Authorization: Apikey <key>) theo constant-time, fail-closed.
 */
export function verifySePayApiKey(authHeader: string | null, expectedKey: string): VerifyResult {
  const cleanKey = (expectedKey || '').trim();
  if (!cleanKey) {
    return { ok: false, reason: 'missing_secret' };
  }

  if (!authHeader || !authHeader.startsWith('Apikey ')) {
    return { ok: false, reason: 'missing_apikey' };
  }

  const provided = authHeader.slice(7);
  if (!constantTimeEqual(provided, cleanKey)) {
    return { ok: false, reason: 'apikey_mismatch' };
  }

  return { ok: true };
}

/**
 * Chuyển đổi chuỗi thời gian của SePay ("YYYY-MM-DD HH:mm:ss" giờ Việt Nam UTC+7) sang ISO-8601 có offset +07:00.
 */
export function toVietnamIsoTimestamp(dateStr?: string | null): string {
  const raw = (dateStr || '').trim();
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(raw)) {
    return `${raw.replace(' ', 'T')}+07:00`;
  }

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
