import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/lib/use-api";
import {
  queryKeys,
  type OrderDto,
  type ProductDto,
} from "@/hooks/query-key/query-key";

export interface InventoryMetricsDto {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
}

export interface AdminOverviewResponse {
  revenue: { amountMinor: number | Record<string, unknown>; currency: string };
  orderCount: number;
  averageOrder: { amountMinor: number | Record<string, unknown>; currency: string };
  paymentHealth: number;
  inventory: InventoryMetricsDto;
  lowStock: ProductDto[];
  exceptions: OrderDto[];
  revenueSeries: Array<{ month?: string; date?: string; revenue?: number; [key: string]: unknown }>;
}

export function useAdminOverview() {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.overview.all,
    queryFn: async () => {
      const response = await api.get<AdminOverviewResponse>("/admin/overview");
      return response.data;
    },
    refetchInterval: 30000, // auto refresh every 30 seconds
  });
}
