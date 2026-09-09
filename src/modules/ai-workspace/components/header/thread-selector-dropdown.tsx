import { useState } from "react";
import {
  MessageSquare,
  ChevronDown,
  Plus,
  Pencil,
  Archive,
  Check,
  Loader2,
  Search,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RenameThreadDialog, ArchiveThreadDialog } from "./thread-action-dialogs";
import type { AiThread } from "../../types/ai-workspace.types";

interface ThreadSelectorDropdownProps {
  threads: AiThread[];
  activeThreadId: string | null;
  activeThread: AiThread | null;
  isLoading: boolean;
  onSelectThread: (threadId: string) => void;
  onCreateThread: () => Promise<unknown>;
  isCreating?: boolean;
  onRenameThread: (threadId: string, newTitle: string) => Promise<unknown>;
  isRenaming?: boolean;
  onArchiveThread: (threadId: string) => Promise<unknown>;
  isArchiving?: boolean;
  align?: "start" | "end" | "center";
  triggerClassName?: string;
}

export function ThreadSelectorDropdown({
  threads,
  activeThreadId,
  activeThread,
  isLoading,
  onSelectThread,
  onCreateThread,
  isCreating,
  onRenameThread,
  isRenaming,
  onArchiveThread,
  isArchiving,
  align = "start",
  triggerClassName,
}: ThreadSelectorDropdownProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [threadToRename, setThreadToRename] = useState<AiThread | null>(null);
  const [threadToArchive, setThreadToArchive] = useState<AiThread | null>(null);

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("vi-VN", {
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const filteredThreads = threads.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <>
      <DropdownMenu>
        {/* Trigger Button using DropdownMenuTrigger */}
        <DropdownMenuTrigger
          className={cn(
            "inline-flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-2.5 h-8 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-xs max-w-[220px] sm:max-w-[280px] outline-none transition select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500/20 data-popup-open:border-blue-400",
            triggerClassName
          )}
        >
          <span className="flex items-center gap-1.5 truncate">
            <MessageSquare className="h-3.5 w-3.5 text-blue-600 shrink-0" />
            <span className="truncate">
              {activeThread ? activeThread.name : "New Thread"}
            </span>
          </span>
          <ChevronDown className="h-3 w-3 text-slate-400 shrink-0 ml-1 transition-transform duration-200 [[data-popup-open]>&]:rotate-180" />
        </DropdownMenuTrigger>

        {/* Dropdown Menu Content */}
        <DropdownMenuContent
          align={align}
          sideOffset={6}
          className="w-80 p-2 rounded-xl shadow-xl border-slate-200 bg-white z-[1300] ring-1 ring-black/5"
        >
          {/* Header with Title & Quick Create */}
          <DropdownMenuGroup>
            <div className="flex items-center justify-between px-2 py-1 pb-2 border-b border-slate-100">
              <DropdownMenuLabel className="p-0 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Threads ({threads.length})
              </DropdownMenuLabel>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCreateThread()}
                disabled={isCreating}
                className="h-6 px-2 text-[11px] text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium gap-1"
              >
                {isCreating ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Plus className="h-3 w-3" />
                )}
                Create New
              </Button>
            </div>
          </DropdownMenuGroup>

          {/* Quick Search if more than 4 threads */}
          {threads.length > 4 && (
            <div className="relative mt-2 mb-1 px-1">
              <Search className="absolute left-3 top-2.5 h-3 w-3 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search threads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                className="w-full rounded-md border border-slate-200 bg-slate-50/60 pl-8 pr-2 py-1 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-blue-400 focus:bg-white transition"
              />
            </div>
          )}

          <DropdownMenuSeparator className="my-1" />

          {/* Scrollable Thread List */}
          <div className="max-h-64 overflow-y-auto py-1 space-y-0.5">
            {isLoading ? (
              <div className="flex items-center justify-center py-6 text-xs text-slate-400 gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
                Loading threads...
              </div>
            ) : filteredThreads.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                {searchQuery ? "No matching threads found." : "No threads yet."}
              </div>
            ) : (
              <DropdownMenuGroup>
                {filteredThreads.map((t) => {
                  const isActive = t.id === activeThreadId;
                  return (
                    <DropdownMenuItem
                      key={t.id}
                      onClick={() => onSelectThread(t.id)}
                      className={`group flex items-center justify-between rounded-lg px-2 py-1.5 text-xs transition cursor-pointer ${
                        isActive
                          ? "bg-blue-50/90 text-blue-900 font-medium shadow-2xs focus:bg-blue-50 focus:text-blue-900"
                          : "text-slate-700 hover:bg-slate-100/80 focus:bg-slate-100/80"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        {isActive ? (
                          <Check className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                        ) : (
                          <MessageSquare className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-xs leading-tight font-medium">
                            {t.name}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {formatDate(t.updatedAt)}
                          </p>
                        </div>
                      </div>

                      {/* Hover action buttons for Rename & Archive */}
                      <div
                        className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setThreadToRename(t);
                          }}
                          title="Rename"
                          className="rounded p-1 text-slate-400 hover:bg-white hover:text-slate-700 hover:shadow-xs transition"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setThreadToArchive(t);
                          }}
                          title="Archive"
                          className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                        >
                          <Archive className="h-3 w-3" />
                        </button>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuGroup>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialogs for rename & archive */}
      <RenameThreadDialog
        thread={threadToRename}
        open={Boolean(threadToRename)}
        onOpenChange={(open) => !open && setThreadToRename(null)}
        onRename={onRenameThread}
        isRenaming={isRenaming}
      />

      <ArchiveThreadDialog
        thread={threadToArchive}
        open={Boolean(threadToArchive)}
        onOpenChange={(open) => !open && setThreadToArchive(null)}
        onArchive={onArchiveThread}
        isArchiving={isArchiving}
      />
    </>
  );
}
