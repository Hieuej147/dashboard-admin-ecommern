import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useCustomer } from "@/hooks/use-customers";
import type { UserDto } from "@/hooks/query-key/query-key";
import { Clock, KeyRound, Loader2, Mail, Shield, User, Copy, Check } from "lucide-react";
import { toast } from "@/components/ui/toast";

interface CustomerDetailProps {
  clerkId: string | null;
  initialData?: UserDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomerDetail({
  clerkId,
  initialData,
  open,
  onOpenChange,
}: CustomerDetailProps) {
  const { data: fetchedUser, isLoading, isError } = useCustomer(clerkId ?? "");
  const user = fetchedUser ?? initialData;
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedKey(label);
    toast.info(`[ COPIED ] ${label.toUpperCase()} copied to clipboard`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const initials =
    user?.displayName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ||
    user?.email?.slice(0, 2).toUpperCase() ||
    "CU";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 rounded-none border border-border bg-card font-mono shadow-hard-md overflow-hidden">
        {/* Terminal Header */}
        <div className="border-b border-border bg-muted/40 p-4">
          <DialogHeader>
            <div className="flex items-center gap-3">
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={user.displayName || user.email}
                  className="h-10 w-10 border border-border object-cover rounded-none"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center border border-border bg-primary text-primary-foreground text-xs font-bold">
                  {initials}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-xs font-bold uppercase tracking-wider text-foreground truncate">
                  {user?.displayName || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "CUSTOMER TELEMETRY"}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5 truncate">
                  <Mail className="h-3 w-3 shrink-0" />
                  <span className="truncate">{user?.email || "No email registered"}</span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-4 space-y-4">
          {isLoading && !user && (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-xs">Loading customer telemetry...</span>
            </div>
          )}

          {isError && !user && (
            <div className="py-8 text-center text-xs text-rose-500">
              [ RECORD NOT FOUND ] Could not retrieve customer record.
            </div>
          )}

          {user && (
            <div className="space-y-4">
              {/* Role & Status Bar */}
              <div className="flex items-center justify-between border border-border bg-muted/20 p-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  STATUS & PRIVILEGES
                </span>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`text-[10px] rounded-none uppercase font-bold tracking-wider ${
                      user.role === "admin"
                        ? "border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-400"
                        : "border-border bg-muted/30 text-foreground"
                    }`}
                  >
                    <Shield className="mr-1 h-2.5 w-2.5" />
                    [ {user.role.toUpperCase()} ]
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`text-[10px] rounded-none uppercase font-bold tracking-wider ${
                      user.status === "active"
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    [ {user.status.toUpperCase()} ]
                  </Badge>
                </div>
              </div>

              {/* Profile Details */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <User className="h-3 w-3" /> PROFILE PARAMETERS
                </span>
                <div className="border border-border divide-y divide-border bg-card text-xs">
                  <div className="flex items-center justify-between p-2">
                    <span className="text-muted-foreground text-[11px]">FIRST NAME</span>
                    <span className="font-bold text-foreground">{user.firstName || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between p-2">
                    <span className="text-muted-foreground text-[11px]">LAST NAME</span>
                    <span className="font-bold text-foreground">{user.lastName || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between p-2">
                    <span className="text-muted-foreground text-[11px]">DISPLAY NAME</span>
                    <span className="font-bold text-foreground">{user.displayName || "—"}</span>
                  </div>
                </div>
              </div>

              {/* Identifiers */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <KeyRound className="h-3 w-3" /> SECURITY IDENTIFIERS
                </span>
                <div className="border border-border divide-y divide-border bg-card text-xs">
                  <div className="flex items-center justify-between p-2">
                    <span className="text-muted-foreground text-[11px]">USER ID</span>
                    <div className="flex items-center gap-1.5 font-bold text-foreground text-[11px]">
                      <span className="truncate max-w-[200px]">{user.id}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(user.id, "User ID")}
                        className="p-0.5 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                        title="Copy User ID"
                      >
                        {copiedKey === "User ID" ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2">
                    <span className="text-muted-foreground text-[11px]">CLERK ID</span>
                    <div className="flex items-center gap-1.5 font-bold text-foreground text-[11px]">
                      <span className="truncate max-w-[200px]">{user.clerkId}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(user.clerkId, "Clerk ID")}
                        className="p-0.5 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                        title="Copy Clerk ID"
                      >
                        {copiedKey === "Clerk ID" ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Clock className="h-3 w-3" /> AUDIT TIMESTAMPS
                </span>
                <div className="border border-border divide-y divide-border bg-card text-xs">
                  <div className="flex items-center justify-between p-2">
                    <span className="text-muted-foreground text-[11px]">REGISTERED</span>
                    <span className="text-foreground text-[11px]">{formatDate(user.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-between p-2">
                    <span className="text-muted-foreground text-[11px]">LAST SYNC</span>
                    <span className="text-foreground text-[11px]">{formatDate(user.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-border bg-muted/40 px-4 py-3 flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            [ CLERK IDENTITY MIRROR ]
          </span>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="border border-border bg-card px-3 py-1 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
