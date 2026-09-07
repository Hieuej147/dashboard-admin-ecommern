import type { components } from "@/lib/types/api";

export type ProductDto = components["schemas"]["ProductDto"];
export type OrderDto = components["schemas"]["OrderDto"];
export type UserDto = components["schemas"]["CurrentUserDto"];
export type CreateOrderBodyDto = components["schemas"]["CreateOrderBodyDto"];

export interface AdminOrderListParams {
  search?: string;
  status?: string;
  paymentStatus?: string;
  from?: string;
  to?: string;
}

export interface AdminProductListParams {
  search?: string;
  status?: string;
}

export interface AdminUserListParams {
  search?: string;
  role?: string;
  status?: string;
}

export const queryKeys = {
  orders: {
    all: ["admin", "orders"] as const,
    list: (params: AdminOrderListParams) =>
      ["admin", "orders", "list", params] as const,
    infinite: (params: AdminOrderListParams) =>
      ["admin", "orders", "infinite", params] as const,
    detail: (id: string) => ["admin", "orders", "detail", id] as const,
    metrics: (range?: { from?: string; to?: string }) =>
      ["admin", "orders", "metrics", range] as const,
  },
  products: {
    all: ["admin", "products"] as const,
    list: (params?: AdminProductListParams) =>
      ["admin", "products", "list", params] as const,
    detail: (id: string) => ["admin", "products", "detail", id] as const,
  },
  payments: {
    all: ["admin", "payments"] as const,
    detail: (id: string) => ["admin", "payments", "detail", id] as const,
    metrics: (range?: { from?: string; to?: string }) =>
      ["admin", "payments", "metrics", range] as const,
  },
  users: {
    all: ["admin", "users"] as const,
    list: (params?: AdminUserListParams) =>
      ["admin", "users", "list", params] as const,
    detail: (clerkId: string) => ["admin", "users", "detail", clerkId] as const,
    me: () => ["admin", "users", "me"] as const,
  },
  overview: {
    all: ["admin", "overview"] as const,
  },
  notifications: {
    all: ["admin", "notifications"] as const,
    unreadCount: () => ["admin", "notifications", "unread-count"] as const,
  },
  health: {
    status: () => ["health", "status"] as const,
  },
};

export interface AdminNotificationDto {
  id: string;
  userId?: string;
  targetRole?: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  href?: string;
  read: boolean;
  readAt?: string | null;
  createdAt: string;
  orderId?: string;
}

