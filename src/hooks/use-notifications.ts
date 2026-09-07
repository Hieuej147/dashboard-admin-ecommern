import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/use-api";
import {
  queryKeys,
  type AdminNotificationDto,
} from "@/hooks/query-key/query-key";

export function useAdminNotifications() {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.notifications.all,
    queryFn: async () => {
      const response = await api.get<AdminNotificationDto[]>("/notifications");
      return response.data;
    },
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
}

export function useAdminUnreadNotificationsCount() {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.notifications.unreadCount(),
    queryFn: async () => {
      const response = await api.get<{ unreadCount: number }>("/notifications/unread-count");
      return response.data;
    },
    staleTime: 30_000,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });
}

export function useMarkAdminNotificationRead() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch<{ id: string; read: boolean; success: boolean }>(
        `/notifications/${id}/read`,
      );
      return response.data;
    },
    onSuccess: ({ id }) => {
      queryClient.setQueryData<AdminNotificationDto[]>(
        queryKeys.notifications.all,
        (current) =>
          current?.map((notif) =>
            notif.id === id ? { ...notif, read: true } : notif,
          ),
      );
      void queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.unreadCount(),
      });
    },
  });
}

export function useMarkAllAdminNotificationsRead() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.post<{ success: boolean; count: number }>(
        "/notifications/read-all",
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.setQueryData<AdminNotificationDto[]>(
        queryKeys.notifications.all,
        (current) =>
          current?.map((notif) => ({ ...notif, read: true })),
      );
      void queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.unreadCount(),
      });
    },
  });
}
