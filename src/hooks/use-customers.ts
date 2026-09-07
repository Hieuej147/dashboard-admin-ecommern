import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/use-api";
import {
  queryKeys,
  type AdminUserListParams,
  type UserDto,
} from "@/hooks/query-key/query-key";

export interface AdminUserListResponse {
  users: UserDto[];
  pageInfo: { hasNextPage: boolean; nextPageToken: string };
}

const DEFAULT_PAGE_SIZE = 10;

export function useCustomers(
  params: AdminUserListParams = {},
  pageSize = DEFAULT_PAGE_SIZE,
) {
  const api = useApi();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [pageToken, setPageToken] = useState<string | undefined>(undefined);
  const tokenHistory = useRef<(string | undefined)[]>([undefined]);

  const paramsKey = JSON.stringify(params);
  useEffect(() => {
    setPage(1);
    setPageToken(undefined);
    tokenHistory.current = [undefined];
  }, [paramsKey]);

  const query = useQuery({
    queryKey: [...queryKeys.users.list(params), pageToken, pageSize],
    queryFn: async () => {
      const response = await api.get<AdminUserListResponse>("/admin/users", {
        params: {
          pageSize,
          pageToken: pageToken || undefined,
          search: params.search || undefined,
          role: params.role || undefined,
          status: params.status || undefined,
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
      queryKey: [...queryKeys.users.list(params), nextToken, pageSize],
      queryFn: async () => {
        const response = await api.get<AdminUserListResponse>("/admin/users", {
          params: {
            pageSize,
            pageToken: nextToken,
            search: params.search || undefined,
            role: params.role || undefined,
            status: params.status || undefined,
          },
        });
        return response.data;
      },
    });
  }, [hasNextPage, query.data?.pageInfo?.nextPageToken, params, pageSize, api, queryClient]);

  return {
    ...query,
    users: query.data?.users ?? [],
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

export function useCustomer(clerkId: string) {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.users.detail(clerkId),
    queryFn: async () => {
      const response = await api.get<UserDto>(`/admin/users/${clerkId}`);
      return response.data;
    },
    enabled: Boolean(clerkId),
  });
}

export function useCurrentUser() {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.users.me(),
    queryFn: async () => {
      const response = await api.get<UserDto>("/me");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

