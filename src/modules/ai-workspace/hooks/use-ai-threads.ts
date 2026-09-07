import { useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/use-api";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { setActiveThreadId as setActiveThreadIdAction } from "@/lib/store/slices/dashboard-ui.slice";
import type {
  AiThread,
  ThreadListResponse,
  CreateThreadInput,
  RenameThreadInput,
} from "../types/ai-workspace.types";

export function useAiThreads(agentId: string = "dashboard") {
  const api = useApi();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const activeThreadId = useAppSelector(
    (state) => state.dashboardUi.activeThreadId
  );

  const setActiveThreadId = useCallback(
    (id: string | null) => {
      dispatch(setActiveThreadIdAction(id));
    },
    [dispatch]
  );

  // Fetch active threads
  const {
    data: threadsData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery<ThreadListResponse>({
    queryKey: ["ai-threads", agentId],
    queryFn: async () => {
      const res = await api.get("/api/copilotkit/threads", {
        params: { agentId, includeArchived: false, limit: 50 },
      });
      return res.data;
    },
    staleTime: 1000 * 30, // 30s
  });

  const threads: AiThread[] = threadsData?.threads ?? [];

  // Create new thread mutation
  const createThreadMutation = useMutation({
    mutationFn: async (input?: CreateThreadInput) => {
      const res = await api.post("/api/copilotkit/threads", {
        agentId: input?.agentId ?? agentId,
        title: input?.title ?? "Hội thoại mới",
      });
      return res.data as AiThread;
    },
    onSuccess: (newThread) => {
      // Optimistically push new thread to cache so threads array immediately contains it
      queryClient.setQueryData<ThreadListResponse>(
        ["ai-threads", agentId],
        (old) => {
          if (!old) return { threads: [newThread], nextCursor: undefined };
          return {
            ...old,
            threads: [newThread, ...old.threads.filter((t) => t.id !== newThread.id)],
          };
        }
      );
      setActiveThreadId(newThread.id);
      queryClient.invalidateQueries({ queryKey: ["ai-threads", agentId] });
    },
  });

  // Automatically select the first thread if none is selected or selected one no longer exists
  useEffect(() => {
    if (isLoading) return;
    if (threads.length > 0) {
      if (!activeThreadId) {
        setActiveThreadId(threads[0].id);
      } else {
        const exists = threads.some((t) => t.id === activeThreadId);
        // Only reset to threads[0] if the thread truly does not exist and we are not currently creating a thread
        if (!exists && !createThreadMutation.isPending) {
          setActiveThreadId(threads[0].id);
        }
      }
    } else if (activeThreadId && threads.length === 0) {
      setActiveThreadId(null);
    }
  }, [threads, activeThreadId, isLoading, createThreadMutation.isPending, setActiveThreadId]);

  // Rename thread mutation
  const renameThreadMutation = useMutation({
    mutationFn: async ({ threadId, title }: RenameThreadInput) => {
      const res = await api.patch(`/api/copilotkit/threads/${threadId}`, {
        title,
      });
      return res.data as AiThread;
    },
    onSuccess: (updatedThread) => {
      queryClient.setQueryData<ThreadListResponse>(
        ["ai-threads", agentId],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            threads: old.threads.map((t) =>
              t.id === updatedThread.id ? { ...t, name: updatedThread.name } : t
            ),
          };
        }
      );
      queryClient.invalidateQueries({ queryKey: ["ai-threads", agentId] });
    },
  });

  // Archive thread mutation
  const archiveThreadMutation = useMutation({
    mutationFn: async (threadId: string) => {
      await api.patch(`/api/copilotkit/threads/${threadId}`, {
        archived: true,
      });
      return threadId;
    },
    onSuccess: (archivedId) => {
      queryClient.setQueryData<ThreadListResponse>(
        ["ai-threads", agentId],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            threads: old.threads.filter((t) => t.id !== archivedId),
          };
        }
      );
      queryClient.invalidateQueries({ queryKey: ["ai-threads", agentId] });
      if (activeThreadId === archivedId) {
        const remaining = threads.filter((t) => t.id !== archivedId);
        setActiveThreadId(remaining.length > 0 ? remaining[0].id : null);
      }
    },
  });

  const activeThread = threads.find((t) => t.id === activeThreadId) || null;

  return {
    threads,
    activeThreadId,
    activeThread,
    isLoading,
    isFetching,
    error,
    refetch,
    setActiveThreadId,
    createThread: createThreadMutation.mutateAsync,
    isCreating: createThreadMutation.isPending,
    renameThread: renameThreadMutation.mutateAsync,
    isRenaming: renameThreadMutation.isPending,
    archiveThread: archiveThreadMutation.mutateAsync,
    isArchiving: archiveThreadMutation.isPending,
  };
}
