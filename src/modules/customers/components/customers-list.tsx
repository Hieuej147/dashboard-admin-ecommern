import React from "react";
import type { UserDto } from "@/hooks/query-key/query-key";
import { CustomerRow } from "./customer-row";

interface CustomersListProps {
  users: UserDto[];
  isPending: boolean;
  isError: boolean;
  error: unknown;
  onRefetch: () => void;
  onOpenDetail: (user: UserDto) => void;
}

export const CustomersList = React.memo(function CustomersList({
  users,
  isPending,
  isError,
  error,
  onRefetch,
  onOpenDetail,
}: CustomersListProps) {
  return (
    <div className="bg-card font-mono select-none">
      {isPending && (
        <div className="py-12 text-center text-xs text-muted-foreground">
          Loading customer accounts registry...
        </div>
      )}

      {isError && (
        <div className="py-12 text-center text-xs text-rose-500">
          <span>
            Error loading customer data:{" "}
            {error instanceof Error
              ? error.message
              : "Please verify Auth / Users API service status."}
          </span>
          <button
            type="button"
            onClick={onRefetch}
            className="ml-2 underline underline-offset-2 text-foreground font-bold cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {!isPending && !isError && users.length === 0 && (
        <div className="py-12 text-center text-xs text-muted-foreground">
          No customer accounts found matching active filters.
        </div>
      )}

      {!isPending &&
        !isError &&
        users.map((user) => (
          <CustomerRow
            key={user.id}
            user={user}
            onOpenDetail={onOpenDetail}
          />
        ))}
    </div>
  );
});
