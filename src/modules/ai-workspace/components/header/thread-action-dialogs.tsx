import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AiThread } from "../../types/ai-workspace.types";

interface RenameThreadDialogProps {
  thread: AiThread | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRename: (threadId: string, newTitle: string) => Promise<unknown>;
  isRenaming?: boolean;
}

export function RenameThreadDialog({
  thread,
  open,
  onOpenChange,
  onRename,
  isRenaming,
}: RenameThreadDialogProps) {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (thread) {
      setTitle(thread.name);
    }
  }, [thread]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thread || !title.trim()) return;
    try {
      await onRename(thread.id, title.trim());
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to rename thread:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold text-slate-900">
              Rename Thread
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Give this thread a concise title to easily reference tasks later.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter thread title..."
              className="text-xs h-9"
              autoFocus
              maxLength={100}
            />
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 text-xs"
              disabled={isRenaming}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isRenaming || !title.trim() || title.trim() === thread?.name}
            >
              {isRenaming ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface ArchiveThreadDialogProps {
  thread: AiThread | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onArchive: (threadId: string) => Promise<unknown>;
  isArchiving?: boolean;
}

export function ArchiveThreadDialog({
  thread,
  open,
  onOpenChange,
  onArchive,
  isArchiving,
}: ArchiveThreadDialogProps) {
  const handleConfirm = async () => {
    if (!thread) return;
    try {
      await onArchive(thread.id);
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to archive thread:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold text-slate-900">
            Archive Thread
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Are you sure you want to archive the thread "
            <span className="font-semibold text-slate-700">
              {thread?.name}
            </span>
            "? This thread will be hidden from the active thread list.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2 pt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 text-xs"
            disabled={isArchiving}
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={handleConfirm}
            className="h-8 text-xs"
            disabled={isArchiving}
          >
            {isArchiving ? "Archiving..." : "Confirm Archive"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
