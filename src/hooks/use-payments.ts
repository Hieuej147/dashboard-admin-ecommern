import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/lib/use-api";
import { queryKeys } from "@/hooks/query-key/query-key";

export interface PaymentMetricsResponse {
  totalCount: number;
  paidCount: number;
  failedCount: number;
  pendingCount: number;
  currency: string;
}

export interface PaymentDetailDto {
  id: string;
  orderId: string;
  userId: string;
  amountMinor: number;
  currency: string;
  providerSessionId?: string;
  providerPaymentId?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

function parseCount(val: unknown): number {
  if (typeof val === "number") return val;
  if (typeof val === "string") return Number(val) || 0;
  if (val && typeof val === "object" && "low" in (val as Record<string, unknown>)) {
    return Number((val as { low: number }).low) || 0;
  }
  return Number(val) || 0;
}

export function usePaymentMetrics(params?: { from?: string; to?: string }) {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.payments.metrics(params),
    queryFn: async (): Promise<PaymentMetricsResponse> => {
      const response = await api.get<Record<string, unknown>>(
        "/payments/admin/metrics",
        { params }
      );
      const data = response.data || {};
      return {
        totalCount: parseCount(data.totalCount ?? data.total_count),
        paidCount: parseCount(data.paidCount ?? data.paid_count),
        failedCount: parseCount(data.failedCount ?? data.failed_count),
        pendingCount: parseCount(data.pendingCount ?? data.pending_count),
        currency: typeof data.currency === "string" ? data.currency : "VND",
      };
    },
    staleTime: 60 * 1000,
  });
}

export function usePayment(id: string) {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.payments.detail(id),
    queryFn: async (): Promise<PaymentDetailDto> => {
      const response = await api.get<Record<string, unknown>>(`/payments/${id}`);
      const data = response.data || {};
      const amountObj = (data.amount && typeof data.amount === "object" ? data.amount : {}) as Record<string, unknown>;
      const amountMinor = parseCount(amountObj.amountMinor ?? data.amountMinor);
      const currency = String(amountObj.currency ?? data.currency ?? "VND");

      return {
        id: String(data.id ?? ""),
        orderId: String(data.orderId ?? data.order_id ?? ""),
        userId: String(data.userId ?? data.user_id ?? ""),
        amountMinor,
        currency,
        providerSessionId: data.providerSessionId ? String(data.providerSessionId) : undefined,
        providerPaymentId: data.providerPaymentId ? String(data.providerPaymentId) : undefined,
        status: String(data.status ?? "UNKNOWN"),
        createdAt: String(data.createdAt ?? data.created_at ?? new Date().toISOString()),
        updatedAt: String(data.updatedAt ?? data.updated_at ?? new Date().toISOString()),
      };
    },
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  });
}

