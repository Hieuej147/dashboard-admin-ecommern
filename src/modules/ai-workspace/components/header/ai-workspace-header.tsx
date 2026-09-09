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
    <div className="flex flex-wrap items-center justify-between gap-3 px-1 py-0.5 shrink-0">
      {/* Brand & Studio Title */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold tracking-tight text-slate-900">
              AI Commerce Studio
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </span>
          </div>
          <p className="text-xs text-slate-500 hidden sm:block">
            E-Commerce Copilot Assistant & A2UI Dynamic Generative Surfaces
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
            className="h-8 gap-1.5 border-slate-200 text-xs text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Clear Canvas</span>
          </Button>
        )}

        <Button
          variant="default"
          size="sm"
          onClick={() => onCreateThread()}
          disabled={isCreatingThread}
          className="h-8 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Thread</span>
        </Button>
      </div>
    </div>
  );
}
