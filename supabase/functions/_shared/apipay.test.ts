import { createHmac } from 'node:crypto';
import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildApiPayAuthHeader,
  extractOrderPaymentCode,
  hasDepositKeyword,
  maskAccountLast4,
  normalizeExpectedAccount,
  toIsoTimestamp,
  verifyApiPaySignature,
} from './apipay.ts';

function signBody(rawBody: string, secret: string): string {
  return createHmac('sha256', secret).update(rawBody).digest('hex');
}

test('verifyApiPaySignature accepts valid HMAC-SHA256 signature on raw body', async () => {
  const secret = 'apipay_wh_secret_123456';
  const rawBody = JSON.stringify({
    event: 'transaction.in',
    data: { transactionId: 'tx_001', amount: '270000', content: 'ORD000001' },
  });
  const sig = signBody(rawBody, secret);

  const result = await verifyApiPaySignature({ rawBody, signatureHeader: sig, secret });
  assert.equal(result.ok, true);
});

test('verifyApiPaySignature fails closed when secret is empty or signature is wrong', async () => {
  const rawBody = '{"event":"transaction.in"}';

  const missingSecret = await verifyApiPaySignature({
    rawBody,
    signatureHeader: signBody(rawBody, 'abc'),
    secret: '   ',
  });
  assert.equal(missingSecret.ok, false);
  assert.equal(missingSecret.reason, 'missing_secret');

  const missingHeader = await verifyApiPaySignature({
    rawBody,
    signatureHeader: null,
    secret: 'secret',
  });
  assert.equal(missingHeader.ok, false);

  const tamperedBody = await verifyApiPaySignature({
    rawBody: '{"event":"transaction.in","tampered":true}',
    signatureHeader: signBody(rawBody, 'secret'),
    secret: 'secret',
  });
  assert.equal(tamperedBody.ok, false);
  assert.equal(tamperedBody.reason, 'signature_mismatch');
});

test('extractOrderPaymentCode extracts and normalizes ORD codes from noisy bank memos', () => {
  assert.equal(extractOrderPaymentCode('ORD000001'), 'ORD000001');
  assert.equal(extractOrderPaymentCode('COC ORD000567'), 'ORD000567');
  assert.equal(extractOrderPaymentCode('COCORD000567'), 'ORD000567');
  assert.equal(extractOrderPaymentCode('MBVCB.99881122.ord000558.CT tu NGUYEN VAN A'), 'ORD000558');
  assert.equal(extractOrderPaymentCode('Thanh toan hoa don ORD-001234 cam on'), 'ORD001234');
  assert.equal(extractOrderPaymentCode('ORD 12345678'), 'ORD12345678');
  assert.equal(extractOrderPaymentCode('Chuyen tien mua hoa'), null);
  assert.equal(extractOrderPaymentCode('RECORD000001'), null);
  assert.equal(extractOrderPaymentCode(null), null);
});

test('hasDepositKeyword detects COC transfer markers without false positives', () => {
  assert.equal(hasDepositKeyword('COC ORD000567'), true);
  assert.equal(hasDepositKeyword('MBVCB.123.coc ORD000567'), true);
  assert.equal(hasDepositKeyword('COCORD000567'), true);
  assert.equal(hasDepositKeyword('ORD000567'), false);
  assert.equal(hasDepositKeyword('COCA COLA ORD000567'), false);
});

test('buildApiPayAuthHeader encodes Bearer base64(accessKey:secretKey)', () => {
  const header = buildApiPayAuthHeader('ak_test_123', 'sk_test_456');
  assert.equal(header, `Bearer ${Buffer.from('ak_test_123:sk_test_456').toString('base64')}`);
});

test('helper utilities normalize accounts, mask last 4 digits, and parse ISO timestamps', () => {
  assert.equal(
    normalizeExpectedAccount({ bankAccountNumber: '0123 456 789', vaNumber: '' }),
    '0123456789',
  );
  assert.equal(
    normalizeExpectedAccount({ bankAccountNumber: '0123456789', vaNumber: 'VA-9988' }),
    'VA9988',
  );
  assert.equal(maskAccountLast4('0123456789'), '****6789');
  assert.equal(toIsoTimestamp('2026-08-12T10:30:00.000Z'), '2026-08-12T10:30:00.000Z');
});
