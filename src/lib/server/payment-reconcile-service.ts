import { apiRequest } from "./api-client";

export interface ReconcileTransaction {
  id: string;
  status: string;
  amount: number;
  currency: string;
  provider: string | null;
  payerPhone: string | null;
  externalReference: string | null;
  failureReason: string | null;
  initiatedAt: string;
  confirmedAt: string | null;
}

export interface ReconcileTransactionPage {
  transactions: ReconcileTransaction[];
  page: number;
  size: number;
  hasMore: boolean;
}

export function listReconcileTransactions(
  accessToken: string,
  params: {
    provider?: string;
    status?: string;
    externalReference?: string;
    page?: number;
    size?: number;
  } = {}
): Promise<ReconcileTransactionPage> {
  return apiRequest<ReconcileTransactionPage>(`/admin/payments/transactions?${toQuery(params)}`, {
    accessToken
  });
}

export function getReconcileTransaction(
  paymentId: string,
  accessToken: string
): Promise<ReconcileTransaction> {
  return apiRequest<ReconcileTransaction>(
    `/admin/payments/transactions/${encodeURIComponent(paymentId)}`,
    { accessToken }
  );
}

function toQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") {
      continue;
    }
    search.set(key, String(value));
  }
  return search.toString();
}
