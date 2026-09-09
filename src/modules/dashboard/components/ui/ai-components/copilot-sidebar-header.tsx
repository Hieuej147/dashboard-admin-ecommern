import { type ReactNode } from "react";
import { Sparkles, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useAiThreads,
  ThreadSelectorDropdown,
} from "@/modules/ai-workspace";

interface CopilotSidebarHeaderProps {
  title?: ReactNode;
  closeButton?: ReactNode;
}

export function CopilotSidebarHeader({
  title,
  closeButton,
}: CopilotSidebarHeaderProps) {
  const navigate = useNavigate();

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

  return (
    <div className="flex items-center justify-between px-3.5 py-2.5 bg-white border-b border-slate-100 text-slate-800 rounded-t-xl gap-2 min-w-0">
      <div className="flex items-center gap-1.5 font-semibold text-xs sm:text-sm shrink-0">
        <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
        <span className="hidden sm:inline">{title || "AI Assistant"}</span>
      </div>

      <div className="flex items-center gap-1.5 min-w-0 flex-1 justify-end">
        <ThreadSelectorDropdown
          threads={threads}
          activeThreadId={activeThreadId}
          activeThread={activeThread}
          isLoading={isLoadingThreads}
          onSelectThread={setActiveThreadId}
          onCreateThread={createThread}
          isCreating={isCreatingThread}
          onRenameThread={(threadId, newTitle) =>
            renameThread({ threadId, title: newTitle })
          }
          isRenaming={isRenamingThread}
          onArchiveThread={archiveThread}
          isArchiving={isArchivingThread}
          align="end"
          triggerClassName="max-w-[140px] sm:max-w-[170px] h-7 text-[11px] px-2"
        />

        <button
          type="button"
          onClick={() => {
            if (typeof document !== "undefined") {
              document.body.style.marginInlineEnd = "";
              document.body.style.marginInlineStart = "";
              document.body.style.marginRight = "";
              document.body.style.marginLeft = "";
              document.body.style.transition = "";
            }
            navigate("/ai-workspace");
          }}
          title="Open full screen in AI Studio"
          className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 h-7 rounded-md transition shrink-0"
        >
          <span className="hidden sm:inline">Open Studio</span>
          <ExternalLink className="w-3 h-3 shrink-0" />
        </button>
        {closeButton}
      </div>
    </div>
  );
}
