import { Sparkles, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThreadSelectorDropdown } from "./thread-selector-dropdown";
import type { AiThread } from "../../types/ai-workspace.types";

interface AiWorkspaceHeaderProps {
  threads: AiThread[];
  activeThreadId: string | null;
  activeThread: AiThread | null;
  isLoadingThreads: boolean;
  onSelectThread: (threadId: string) => void;
  onCreateThread: () => Promise<unknown>;
  isCreatingThread?: boolean;
  onRenameThread: (threadId: string, newTitle: string) => Promise<unknown>;
  isRenamingThread?: boolean;
  onArchiveThread: (threadId: string) => Promise<unknown>;
  isArchivingThread?: boolean;
  hasActiveDashboard: boolean;
  onClearCanvas: () => void;
}

export function AiWorkspaceHeader({
  threads,
  activeThreadId,
  activeThread,
  isLoadingThreads,
  onSelectThread,
  onCreateThread,
  isCreatingThread,
  onRenameThread,
  isRenamingThread,
  onArchiveThread,
  isArchivingThread,
  hasActiveDashboard,
  onClearCanvas,
}: AiWorkspaceHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-1 py-1 shrink-0 border-b border-border pb-3 font-mono">
      {/* Brand & Studio Title */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center border border-border bg-card text-foreground font-bold shadow-hard-sm">
          <Sparkles className="h-4 w-4 text-[#ece945]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-heading font-bold uppercase tracking-wider text-foreground">
              AI COMMERCE STUDIO
            </h1>
            <span className="border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              [ ONLINE: OPERATIONAL ]
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground hidden sm:block">
            Executive commerce assistant and real-time A2UI visual surface
          </p>
        </div>
      </div>

      {/* Thread Dropdown & Action Buttons */}
      <div className="flex items-center gap-2">
        <ThreadSelectorDropdown
          threads={threads}
          activeThreadId={activeThreadId}
          activeThread={activeThread}
          isLoading={isLoadingThreads}
          onSelectThread={onSelectThread}
          onCreateThread={onCreateThread}
          isCreating={isCreatingThread}
          onRenameThread={onRenameThread}
          isRenaming={isRenamingThread}
          onArchiveThread={onArchiveThread}
          isArchiving={isArchivingThread}
        />

        {hasActiveDashboard && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearCanvas}
            className="h-8 gap-1.5 border border-border bg-card text-xs font-bold text-rose-500 hover:bg-rose-500/10 rounded-none shadow-hard-sm cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden md:inline">CLEAR CANVAS</span>
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onCreateThread()}
          disabled={isCreatingThread}
          className="h-8 gap-1.5 border border-border bg-card hover:bg-muted text-foreground text-xs font-bold rounded-none shadow-hard-sm cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5 text-[#ece945]" />
          <span>NEW THREAD</span>
        </Button>
      </div>
    </div>
  );
}
