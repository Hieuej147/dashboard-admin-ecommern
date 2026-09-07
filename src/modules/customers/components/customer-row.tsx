import React from "react";
import { Eye, Mail, Shield, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
      className="flex flex-col gap-4 px-5 py-4 transition hover:bg-slate-50 sm:flex-row sm:items-center cursor-pointer"
      onClick={() => onOpenDetail(user)}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {user.imageUrl ? (
          <img
            src={user.imageUrl}
            alt={displayName}
            className="h-10 w-10 shrink-0 rounded-full border border-slate-200 object-cover"
          />
        ) : (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-700">
            {initials}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-800">
            {displayName}
          </p>
          <p className="flex items-center gap-1 truncate text-xs text-slate-400">
            <Mail className="h-3 w-3" />
            {user.email || "No email"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 items-center gap-6 text-sm sm:w-[360px]">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-400">
            Role
          </p>
          <Badge
            variant="outline"
            className={
              user.role === "admin"
                ? "mt-1 border-purple-200 bg-purple-50 text-purple-700"
                : "mt-1 border-blue-200 bg-blue-50 text-blue-700"
            }
          >
            <Shield className="mr-1 h-3 w-3" />
            {user.role}
          </Badge>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-400">
            Status
          </p>
          <Badge
            variant="outline"
            className={
              user.status === "active"
                ? "mt-1 border-emerald-200 bg-emerald-50 text-emerald-700"
                : "mt-1 border-rose-200 bg-rose-50 text-rose-700"
            }
          >
            <UserCheck className="mr-1 h-3 w-3" />
            {user.status}
          </Badge>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            aria-label={`View details for ${displayName}`}
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail(user);
            }}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
});
