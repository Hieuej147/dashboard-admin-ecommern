import { useState, useCallback } from "react";
import { useCustomers } from "@/hooks/use-customers";
import type { UserDto } from "@/hooks/query-key/query-key";
import {
  CustomersHeader,
  CustomersFilterBar,
  CustomersList,
  CustomersPagination,
  CustomerDetail,
} from "../";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const {
    users,
    page,
    hasNextPage,
    hasPrevPage,
    goNextPage,
    goPrevPage,
    prefetchNextPage,
    isPending,
    isFetching,
    isError,
    error,
    refetch,
  } = useCustomers({
    search: search || undefined,
    role: role || undefined,
  });

  const handleOpenDetail = useCallback((user: UserDto) => {
    setSelectedUser(user);
    setDetailOpen(true);
  }, []);

  const handleRefetch = useCallback(() => {
    void refetch();
  }, [refetch]);

  return (
    <div className="flex flex-col gap-6">
      <CustomersHeader />

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <CustomersFilterBar
          search={search}
          onSearchChange={setSearch}
          role={role}
          onRoleChange={setRole}
        />

        <CustomersList
          users={users}
          isPending={isPending}
          isError={isError}
          error={error}
          onRefetch={handleRefetch}
          onOpenDetail={handleOpenDetail}
        />

        <CustomersPagination
          page={page}
          totalCustomers={users.length}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          isFetching={isFetching}
          isPending={isPending}
          onPrevPage={goPrevPage}
          onNextPage={goNextPage}
          onPrefetchNextPage={prefetchNextPage}
        />
      </div>

      <CustomerDetail
        clerkId={selectedUser?.clerkId ?? null}
        initialData={selectedUser}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}
