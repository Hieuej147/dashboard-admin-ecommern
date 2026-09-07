import { useState } from "react";
import { useAppSelector } from "@/lib/store/store";
import {
  AiWorkspaceHeader,
  ChatPanel,
  CanvasPanel,
  AiWorkspaceErrorBoundary,
  useAiThreads,
  useAiWorkspaceActions,
  type AiWorkspaceTab,
} from "..";

export default function AiWorkspacePage() {
  const [activeTab, setActiveTab] = useState<AiWorkspaceTab>("canvas");
  const activeDashboardId = useAppSelector(
    (state) => state.dashboardUi.activeDashboardId
  );

  // Durable Thread management backed by agent-service and PostgreSQL
  const {
    threads,
    activeThreadId,
    activeThread,
    isLoading: isLoadingThreads,
    setActiveThreadId,
    createThread,
    isCreating: isCreatingThread,
    renameThread,
    isRenaming: isRenamingThread,
    archiveThread,
    isArchiving: isArchivingThread,
  } = useAiThreads("dashboard");

  // Agent workspace interactions
  const {
    isRunning,
    sendPrompt,
    clearCanvas,
  } = useAiWorkspaceActions({
    onSwitchTab: setActiveTab,
    onCreateNewThread: async () => {
      await createThread();
    },
  });

  const handleCreateNewThread = async () => {
    try {
      await createThread();
      clearCanvas();
    } catch (err) {
      console.error("Failed to create new thread:", err);
    }
  };

  const handleRenameThread = async (threadId: string, newTitle: string) => {
    await renameThread({ threadId, title: newTitle });
  };

  return (
    <AiWorkspaceErrorBoundary>
      <div className="flex h-[calc(100vh-5.5rem)] flex-col gap-3 min-w-0 overflow-hidden">
        {/* Top Studio Bar with Dynamic Thread Selector */}
        <AiWorkspaceHeader
          threads={threads}
          activeThreadId={activeThreadId}
          activeThread={activeThread}
          isLoadingThreads={isLoadingThreads}
          onSelectThread={setActiveThreadId}
          onCreateThread={handleCreateNewThread}
          isCreatingThread={isCreatingThread}
          onRenameThread={handleRenameThread}
          isRenamingThread={isRenamingThread}
          onArchiveThread={archiveThread}
          isArchivingThread={isArchivingThread}
          hasActiveDashboard={Boolean(activeDashboardId)}
          onClearCanvas={clearCanvas}
        />

        {/* Main Split Layout: Left Chat + Right Canvas */}
        <div className="flex flex-1 min-h-0 gap-4 overflow-hidden">
          {/* Left Column: Copilot Chat Engine */}
          <ChatPanel
            activeThreadId={activeThreadId}
            isRunning={isRunning}
            onSendPrompt={sendPrompt}
          />

          {/* Right Column: Live A2UI Canvas & Knowledge Studio */}
          <CanvasPanel
            activeTab={activeTab}
            onTabChange={setActiveTab}
            hasActiveDashboard={Boolean(activeDashboardId)}
            onSelectPrompt={sendPrompt}
            isRunning={isRunning}
          />
        </div>
      </div>
    </AiWorkspaceErrorBoundary>
  );
}
