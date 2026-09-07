import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useCustomer } from "@/hooks/use-customers";
import type { UserDto } from "@/hooks/query-key/query-key";
import { Clock, KeyRound, Loader2, Mail, Shield, User } from "lucide-react";

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
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {isLoading && !user && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        )}

        {isError && !user && (
          <div className="py-16 text-center text-sm text-slate-500">
            Could not load customer details.
          </div>
        )}

        {user && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.displayName || user.email}
                    className="h-12 w-12 rounded-full border border-slate-200 object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-700">
                    {initials}
                  </div>
                )}
                <div>
                  <DialogTitle className="text-base font-semibold text-slate-900">
                    {user.displayName || `${user.firstName} ${user.lastName}`.trim() || "Customer"}
                  </DialogTitle>
                  <DialogDescription className="flex items-center gap-1 text-xs text-slate-500">
                    <Mail className="h-3 w-3" />
                    {user.email || "No email available"}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={
                  user.role === "admin"
                    ? "border-purple-200 bg-purple-50 text-purple-700"
                    : "border-blue-200 bg-blue-50 text-blue-700"
                }
              >
                <Shield className="mr-1 h-3 w-3" />
                {user.role.toUpperCase()}
              </Badge>
              <Badge
                variant="outline"
                className={
                  user.status === "active"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-rose-200 bg-rose-50 text-rose-700"
                }
              >
                {user.status.toUpperCase()}
              </Badge>
            </div>

            <Separator />

            <div className="space-y-3 text-sm">
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <User className="h-4 w-4" /> Account Details
              </h3>
              <div className="grid grid-cols-3 gap-y-2 rounded-lg bg-slate-50 p-3 text-xs">
                <span className="text-slate-400">First Name</span>
                <span className="col-span-2 font-medium text-slate-700">
                  {user.firstName || "—"}
                </span>

                <span className="text-slate-400">Last Name</span>
                <span className="col-span-2 font-medium text-slate-700">
                  {user.lastName || "—"}
                </span>

                <span className="text-slate-400">Display Name</span>
                <span className="col-span-2 font-medium text-slate-700">
                  {user.displayName || "—"}
                </span>
              </div>
            </div>

            <Separator />

            <div className="space-y-3 text-sm">
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <KeyRound className="h-4 w-4" /> Identifiers
              </h3>
              <div className="grid grid-cols-3 gap-y-2 rounded-lg bg-slate-50 p-3 text-xs font-mono">
                <span className="text-slate-400 font-sans">User ID</span>
                <span className="col-span-2 break-all text-slate-700">{user.id}</span>

                <span className="text-slate-400 font-sans">Clerk ID</span>
                <span className="col-span-2 break-all text-slate-700">{user.clerkId}</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-3 text-sm">
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <Clock className="h-4 w-4" /> Timestamps
              </h3>
              <div className="grid grid-cols-3 gap-y-2 rounded-lg bg-slate-50 p-3 text-xs">
                <span className="text-slate-400">Joined</span>
                <span className="col-span-2 text-slate-700">{formatDate(user.createdAt)}</span>

                <span className="text-slate-400">Updated</span>
                <span className="col-span-2 text-slate-700">{formatDate(user.updatedAt)}</span>
              </div>
            </div>

            <DialogFooter showCloseButton />
          </>
        )}
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
