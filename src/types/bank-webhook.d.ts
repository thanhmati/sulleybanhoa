export type BankWebhookMatchStatus =
  | 'MATCHED'
  | 'PARTIAL'
  | 'OVERPAID'
  | 'UNMATCHED'
  | 'IGNORED'
  | 'ERROR';

export type BankWebhookSource = 'WEBHOOK' | 'RECONCILE_API' | 'MANUAL_ASSIGN';

export interface IMatchedOrderSummary {
  id: string;
  orderNumber: string;
  paymentCode: string;
  clientName: string;
  dueAmount: number;
  isPaid: boolean;
  status: string;
}

export interface IBankWebhookLog {
  id: string;
  provider: string;
  externalTxId: string | null;
  sepayApiId: string | null;
  gateway: string | null;
  accountNumber: string | null;
  subAccount: string | null;
  transferType: 'in' | 'out';
  amount: number;
  paymentCode: string | null;
  content: string | null;
  referenceCode: string | null;
  transactionDate: string | null;
  matchedOrderId: string | null;
  orderTransactionId: string | null;
  matchStatus: BankWebhookMatchStatus;
  webhookSuccess: boolean;
  source: BankWebhookSource;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  matchedOrder?: IMatchedOrderSummary | null;
}

export interface ISePayReconcileSummary {
  success: boolean;
  rateLimited: boolean;
  fetched: number;
  matched: number;
  partial: number;
  overpaid: number;
  unmatched: number;
  duplicates: number;
}
