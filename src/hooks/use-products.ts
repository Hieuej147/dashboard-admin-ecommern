import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/use-api";
import {
  queryKeys,
  type AdminProductListParams,
  type ProductDto,
} from "@/hooks/query-key/query-key";

export interface ListProductsResponse {
  products: ProductDto[];
  pageInfo: { hasNextPage: boolean; nextPageToken: string };
}

export interface CreateProductInput {
  slug: string;
  name: string;
  description?: string;
  stockQuantity: number;
  priceAmountMinor: number;
  currency?: string;
  colors?: string[];
  sizes?: string[];
  images?: Record<string, string>;
}

export interface UpdateProductInput {
  id: string;
  data: {
    name?: string;
    description?: string;
    stockQuantity?: number;
    priceAmountMinor?: number;
    currency?: string;
    colors?: string[];
    sizes?: string[];
    images?: Record<string, string>;
  };
}

const DEFAULT_PAGE_SIZE = 10;

export function useProducts(
  params: AdminProductListParams = {},
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
    queryKey: [...queryKeys.products.list(params), pageToken, pageSize],
    queryFn: async () => {
      const response = await api.get<ListProductsResponse>("/products", {
        params: {
          pageSize,
          pageToken: pageToken || undefined,
          search: params.search || undefined,
          status:
            params.status && params.status !== "all"
              ? params.status
              : undefined,
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
      queryKey: [...queryKeys.products.list(params), nextToken, pageSize],
      queryFn: async () => {
        const response = await api.get<ListProductsResponse>("/products", {
          params: {
            pageSize,
            pageToken: nextToken,
            search: params.search || undefined,
            status:
              params.status && params.status !== "all"
                ? params.status
                : undefined,
          },
        });
        return response.data;
      },
    });
  }, [hasNextPage, query.data?.pageInfo?.nextPageToken, params, pageSize, api, queryClient]);

  return {
    ...query,
    products: query.data?.products ?? [],
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

export function useProduct(id: string) {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: async () => {
      const response = await api.get<ProductDto>(`/products/${id}`);
      return response.data;
    },
    enabled: Boolean(id),
  });
}

export function useCreateProduct() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateProductInput) => {
      const response = await api.post<ProductDto>("/products", {
        slug: input.slug,
        name: input.name,
        description: input.description,
        stockQuantity: input.stockQuantity,
        priceAmountMinor: input.priceAmountMinor,
        currency: input.currency ?? "VND",
        colors: input.colors ?? [],
        sizes: input.sizes ?? [],
        images: input.images ?? {},
      });
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}

export function useUpdateProduct() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UpdateProductInput) => {
      const response = await api.patch<ProductDto>(`/products/${id}`, {
        name: data.name,
        description: data.description,
        stockQuantity: data.stockQuantity,
        priceAmountMinor: data.priceAmountMinor,
        currency: data.currency ?? "VND",
        colors: data.colors,
        sizes: data.sizes,
        images: data.images,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(variables.id),
      });
    },
  });
}

export function useDeleteProduct() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}
