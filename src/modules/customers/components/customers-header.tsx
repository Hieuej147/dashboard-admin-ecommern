import React from "react";

export const CustomersHeader = React.memo(function CustomersHeader() {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-500">
          Relationship
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          Customers
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your store's users and customer accounts.
        </p>
      </div>
    </div>
  );
});
