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
    <div className="flex items-center justify-between px-3 py-2.5 bg-card border-b border-border text-foreground font-mono gap-2 min-w-0 rounded-none">
      <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-foreground shrink-0">
        <span className="flex h-5 w-5 items-center justify-center border border-border bg-muted/40">
          <Sparkles className="w-3 h-3 text-[#ece945] shrink-0" />
        </span>
        <span className="hidden sm:inline">{title || "[ AI COPILOT ]"}</span>
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
          triggerClassName="max-w-[130px] sm:max-w-[160px] h-7 text-[10px] px-2 rounded-none border-border bg-card text-foreground hover:bg-muted"
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
          className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-foreground hover:bg-muted border border-border bg-card px-2 py-1 h-7 rounded-none transition shrink-0 cursor-pointer shadow-hard-sm"
        >
          <span className="hidden sm:inline">STUDIO</span>
          <ExternalLink className="w-2.5 h-2.5 shrink-0 text-[#ece945]" />
        </button>
        {closeButton}
      </div>
    </div>
  );
}
