import React from "react";
import { Eye, Mail, Shield, UserCheck } from "lucide-react";
import type { UserDto } from "@/hooks/query-key/query-key";

interface CustomerRowProps {
  user: UserDto;
  onOpenDetail: (user: UserDto) => void;
}

export const CustomerRow = React.memo(function CustomerRow({
  user,
  onOpenDetail,
}: CustomerRowProps) {
  const displayName =
    user.displayName ||
    `${user.firstName} ${user.lastName}`.trim() ||
    "Customer";

  const initials =
    displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "CU";

  return (
    <div
      className="flex flex-col gap-3 px-4 py-3.5 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center cursor-pointer border-b border-border/70 font-mono select-none"
      onClick={() => onOpenDetail(user)}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {user.imageUrl ? (
          <img
            src={user.imageUrl}
            alt={displayName}
            className="h-9 w-9 shrink-0 border border-border object-cover"
          />
        ) : (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-border bg-muted/40 text-xs font-bold text-foreground">
            {initials}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-xs font-bold text-foreground">
            {displayName}
          </p>
          <p className="flex items-center gap-1.5 truncate text-[11px] text-muted-foreground select-all">
            <Mail className="h-3 w-3 shrink-0" />
            {user.email || "No email available"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 items-center gap-4 text-xs sm:w-[360px]">
        <div>
          <span
            className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold uppercase border ${
              user.role === "admin"
                ? "border-purple-500/40 bg-purple-50/10 text-purple-600 dark:text-purple-400"
                : "border-border bg-muted/30 text-muted-foreground"
            }`}
          >
            <Shield className="mr-1 h-3 w-3" />
            {user.role === "admin" ? "ADMIN" : "CUSTOMER"}
          </span>
        </div>

        <div>
          <span
            className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold uppercase border ${
              user.status === "active"
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400"
            }`}
          >
            <UserCheck className="mr-1 h-3 w-3" />
            {user.status === "active" ? "ACTIVE" : "LOCKED"}
          </span>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            aria-label={`View details for ${displayName}`}
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail(user);
            }}
            className="border border-border p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            title="View customer details"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
});
