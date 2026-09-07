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
    <div className="divide-y divide-slate-100 bg-white">
      {isPending && (
        <div className="py-12 text-center text-sm text-slate-500">
          Loading customers...
        </div>
      )}

      {isError && (
        <div className="py-12 text-center text-sm text-slate-500">
          <span>
            Could not load customers:{" "}
            {error instanceof Error
              ? error.message
              : "Please check that the API is running."}
          </span>
          <button
            type="button"
            onClick={onRefetch}
            className="ml-2 underline underline-offset-2"
          >
            Try again
          </button>
        </div>
      )}

      {!isPending && !isError && users.length === 0 && (
        <div className="py-12 text-center text-sm text-slate-500">
          No customers found.
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
