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
            "inline-flex items-center justify-between gap-2 rounded-none border border-border bg-card px-2.5 h-8 text-xs font-bold text-foreground hover:bg-muted shadow-hard-sm max-w-[220px] sm:max-w-[280px] outline-none transition select-none cursor-pointer font-mono",
            triggerClassName
          )}
        >
          <span className="flex items-center gap-1.5 truncate">
            <MessageSquare className="h-3.5 w-3.5 text-foreground shrink-0" />
            <span className="truncate">
              {activeThread ? activeThread.name : "New Thread"}
            </span>
          </span>
          <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0 ml-1 transition-transform duration-200 [[data-popup-open]>&]:rotate-180" />
        </DropdownMenuTrigger>

        {/* Dropdown Menu Content */}
        <DropdownMenuContent
          align={align}
          sideOffset={6}
          className="w-80 p-2 rounded-none shadow-hard-md border border-border bg-card text-foreground z-[1300] font-mono"
        >
          {/* Header with Title & Quick Create */}
          <DropdownMenuGroup>
            <div className="flex items-center justify-between px-2 py-1 pb-2 border-b border-border">
              <DropdownMenuLabel className="p-0 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                THREADS ({threads.length})
              </DropdownMenuLabel>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCreateThread()}
                disabled={isCreating}
                className="h-6 px-2 text-[11px] text-foreground hover:bg-muted font-bold gap-1 rounded-none border border-border bg-card shadow-hard-sm"
              >
                {isCreating ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Plus className="h-3 w-3 text-[#ece945]" />
                )}
                NEW
              </Button>
            </div>
          </DropdownMenuGroup>

          {/* Quick Search if more than 4 threads */}
          {threads.length > 4 && (
            <div className="relative mt-2 mb-1 px-1">
              <Search className="absolute left-3 top-2.5 h-3 w-3 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search threads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                className="w-full rounded-none border border-border bg-background pl-8 pr-2 py-1 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground transition"
              />
            </div>
          )}

          <DropdownMenuSeparator className="my-1 border-border" />

          {/* Scrollable Thread List */}
          <div className="max-h-64 overflow-y-auto py-1 space-y-0.5">
            {isLoading ? (
              <div className="flex items-center justify-center py-6 text-xs text-muted-foreground gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-foreground" />
                Loading threads...
              </div>
            ) : filteredThreads.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground">
                {searchQuery ? "[ NO THREADS FOUND ]" : "[ NO ACTIVE THREADS ]"}
              </div>
            ) : (
              <DropdownMenuGroup>
                {filteredThreads.map((t) => {
                  const isActive = t.id === activeThreadId;
                  return (
                    <DropdownMenuItem
                      key={t.id}
                      onClick={() => onSelectThread(t.id)}
                      className={`group flex items-center justify-between rounded-none px-2 py-1.5 text-xs transition cursor-pointer ${
                        isActive
                          ? "bg-muted text-foreground font-bold border-l-2 border-l-[#ece945]"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        {isActive ? (
                          <Check className="h-3.5 w-3.5 text-[#ece945] shrink-0" />
                        ) : (
                          <MessageSquare className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-xs leading-tight font-bold text-foreground">
                            {t.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
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
                          title="Rename thread"
                          className="rounded-none p-1 text-muted-foreground hover:bg-card hover:text-foreground border border-transparent hover:border-border transition"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setThreadToArchive(t);
                          }}
                          title="Archive thread"
                          className="rounded-none p-1 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 border border-transparent hover:border-rose-500/30 transition"
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
