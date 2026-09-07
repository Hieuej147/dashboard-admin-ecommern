import { useCallback } from "react";
import { useAgent, useCopilotKit, UseAgentUpdate } from "@copilotkit/react-core/v2";
import { useAppDispatch } from "@/lib/store/store";
import { setActiveDashboard } from "@/lib/store/slices/dashboard-ui.slice";
import type { AiWorkspaceTab } from "../types/ai-workspace.types";

interface UseAiWorkspaceActionsProps {
  onSwitchTab?: (tab: AiWorkspaceTab) => void;
  onCreateNewThread?: () => Promise<unknown>;
}

export function useAiWorkspaceActions({
  onSwitchTab,
  onCreateNewThread,
}: UseAiWorkspaceActionsProps = {}) {
  const dispatch = useAppDispatch();
  const { agent } = useAgent({
    updates: [UseAgentUpdate.OnMessagesChanged, UseAgentUpdate.OnRunStatusChanged],
  });
  const { copilotkit } = useCopilotKit();

  const sendPrompt = useCallback(
    async (promptText: string) => {
      if (!agent) {
        console.warn("Agent is not ready yet.");
        return;
      }

      agent.addMessage({
        id: crypto.randomUUID(),
        role: "user",
        content: promptText,
      });

      // Switch to live canvas to show interactive charts/cards
      if (onSwitchTab) {
        onSwitchTab("canvas");
      }

      try {
        await copilotkit.runAgent({ agent });
      } catch (err) {
        console.error("Failed to run agent:", err);
      }
    },
    [agent, copilotkit, onSwitchTab]
  );

  const clearCanvas = useCallback(() => {
    dispatch(setActiveDashboard(null));
  }, [dispatch]);

  const handleResetChat = useCallback(async () => {
    if (onCreateNewThread) {
      await onCreateNewThread();
    } else if (agent) {
      agent.setMessages([]);
    }
    dispatch(setActiveDashboard(null));
  }, [agent, dispatch, onCreateNewThread]);

  return {
    agent,
    isRunning: Boolean(agent?.isRunning),
    sendPrompt,
    clearCanvas,
    handleResetChat,
  };
}
