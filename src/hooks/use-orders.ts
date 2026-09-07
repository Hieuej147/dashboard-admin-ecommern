import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/use-api";
import {
  queryKeys,
  type AdminOrderListParams,
  type OrderDto,
} from "@/hooks/query-key/query-key";

export interface AdminOrderListResponse {
  orders: OrderDto[];
  pageInfo: { hasNextPage: boolean; nextPageToken: string };
}

const DEFAULT_PAGE_SIZE = 10;

export function useAdminOrders(
  params: AdminOrderListParams = {},
  pageSize = DEFAULT_PAGE_SIZE,
) {
  const api = useApi();
  const queryClient = useQueryClient();

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageToken, setPageToken] = useState<string | undefined>(undefined);
  // History of tokens: index 0 = page 1 (undefined), index 1 = page 2 token, ...
  const tokenHistory = useRef<(string | undefined)[]>([undefined]);

  // Reset to page 1 when filters change
  const paramsKey = JSON.stringify(params);
  useEffect(() => {
    setPage(1);
    setPageToken(undefined);
    tokenHistory.current = [undefined];
  }, [paramsKey]);

  const query = useQuery({
    queryKey: [...queryKeys.orders.list(params), pageToken, pageSize],
    queryFn: async () => {
      const response = await api.get<AdminOrderListResponse>("/orders/admin", {
        params: {
          pageSize,
          pageToken: pageToken || undefined,
          search: params.search || undefined,
          status: params.status || undefined,
          paymentStatus: params.paymentStatus || undefined,
          from: params.from || undefined,
          to: params.to || undefined,
        },
      });
      return response.data;
    },
    placeholderData: (prev) => prev,
  });

  const hasNextPage = query.data?.pageInfo?.hasNextPage ?? false;
  const hasPrevPage = page > 1;

  const goNextPage = useCallback(() => {
    const nextToken = query.data?.pageInfo?.nextPageToken;
    if (!hasNextPage || !nextToken) return;

    const nextPage = page + 1;
    // Store the token for this next page
    tokenHistory.current[nextPage - 1] = nextToken;
    setPageToken(nextToken);
    setPage(nextPage);
  }, [hasNextPage, page, query.data?.pageInfo?.nextPageToken]);

  const goPrevPage = useCallback(() => {
    if (!hasPrevPage) return;

    const prevPage = page - 1;
    setPageToken(tokenHistory.current[prevPage - 1]);
    setPage(prevPage);
  }, [hasPrevPage, page]);

  const resetPage = useCallback(() => {
    setPage(1);
    setPageToken(undefined);
    tokenHistory.current = [undefined];
  }, []);

  const prefetchNextPage = useCallback(() => {
    const nextToken = query.data?.pageInfo?.nextPageToken;
    if (!hasNextPage || !nextToken) return;

    void queryClient.prefetchQuery({
      queryKey: [...queryKeys.orders.list(params), nextToken, pageSize],
      queryFn: async () => {
        const response = await api.get<AdminOrderListResponse>("/orders/admin", {
          params: {
            pageSize,
            pageToken: nextToken,
            search: params.search || undefined,
            status: params.status || undefined,
            paymentStatus: params.paymentStatus || undefined,
            from: params.from || undefined,
            to: params.to || undefined,
          },
        });
        return response.data;
      },
    });
  }, [hasNextPage, query.data?.pageInfo?.nextPageToken, params, pageSize, api, queryClient]);

  return {
    ...query,
    orders: query.data?.orders ?? [],
    // Pagination
    page,
    pageSize,
    hasNextPage,
    hasPrevPage,
    goNextPage,
    goPrevPage,
    resetPage,
    prefetchNextPage,
  };
}

export function useOrder(id: string) {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: async () => {
      const response = await api.get<OrderDto>(`/orders/${id}`);
      return response.data;
    },
    enabled: Boolean(id),
  });
}

export function useCancelOrder() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await api.post<OrderDto>(`/orders/${orderId}/cancel`);
      return response.data;
    },
    onSuccess: (_data, orderId) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(orderId) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.overview.all });
    },
  });
}

export interface RawOrderMetricsResponse {
  orderCount?: number | string;
  order_count?: number | string;
  totalOrders?: number | string;
  paidOrderCount?: number | string;
  paid_order_count?: number | string;
  paidOrders?: number | string;
  pendingOrderCount?: number | string;
  pending_order_count?: number | string;
  revenueAmountMinor?: number | string;
  revenue_amount_minor?: number | string;
  currency?: string;
  revenue?: { amountMinor: number; currency: string };
  averageOrderValue?: { amountMinor: number; currency: string };
}

export interface OrderMetricsResponse {
  totalOrders: number;
  paidOrders: number;
  pendingOrders: number;
  revenue: { amountMinor: number; currency: string };
  averageOrderValue: { amountMinor: number; currency: string };
}

function parseCount(val: unknown): number {
  if (typeof val === "number") return Number.isNaN(val) ? 0 : val;
  if (typeof val === "string") {
    const parsed = Number(val);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  if (val && typeof val === "object") {
    if ("low" in (val as Record<string, unknown>)) {
      const low = Number((val as { low: unknown }).low);
      return Number.isNaN(low) ? 0 : low;
    }
    if ("amountMinor" in (val as Record<string, unknown>)) {
      return parseCount((val as { amountMinor: unknown }).amountMinor);
    }
  }
  return 0;
}

export function useOrderMetrics(params?: { from?: string; to?: string }) {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.orders.metrics(params),
    queryFn: async (): Promise<OrderMetricsResponse> => {
      const response = await api.get<RawOrderMetricsResponse>("/orders/admin/metrics", {
        params,
      });
      const data = response.data || {};
      const totalOrders = parseCount(
        data.orderCount ?? data.order_count ?? data.totalOrders
      );
      const paidOrders = parseCount(
        data.paidOrderCount ?? data.paid_order_count ?? data.paidOrders
      );
      const pendingOrders = parseCount(
        data.pendingOrderCount ?? data.pending_order_count
      );
      const revenueAmountMinor = parseCount(
        data.revenueAmountMinor ??
          data.revenue_amount_minor ??
          data.revenue?.amountMinor
      );
      const currency = data.currency || data.revenue?.currency || "VND";
      const averageOrderValue =
        paidOrders > 0
          ? Math.round(revenueAmountMinor / paidOrders)
          : parseCount(data.averageOrderValue?.amountMinor);

      return {
        totalOrders,
        paidOrders,
        pendingOrders,
        revenue: { amountMinor: revenueAmountMinor, currency },
        averageOrderValue: { amountMinor: averageOrderValue, currency },
      };
    },
    staleTime: 60 * 1000,
  });
}
