import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { queryKeys } from "@/hooks/query-key/query-key";

export interface HealthStatus {
  status: string;
  latencyMs: number;
  timestamp: string;
}

export function useHealth() {
  return useQuery({
    queryKey: queryKeys.health.status(),
    queryFn: async (): Promise<HealthStatus> => {
      const start = performance.now();
      const res = await apiClient.get<{ status: string }>("/health");
      const latencyMs = Math.round(performance.now() - start);
      return {
        status: res.data?.status || "ok",
        latencyMs,
        timestamp: new Date().toLocaleTimeString(),
      };
    },
    refetchInterval: 30000,
    staleTime: 10000,
    retry: 1,
  });
}
