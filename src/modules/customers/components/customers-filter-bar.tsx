import React from "react";
import { Search } from "lucide-react";

interface CustomersFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  role: string;
  onRoleChange: (value: string) => void;
}

export const CustomersFilterBar = React.memo(function CustomersFilterBar({
  search,
  onSearchChange,
  role,
  onRoleChange,
}: CustomersFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-100 p-3 sm:flex-row bg-white rounded-t-xl">
      <label className="flex flex-1 items-center gap-2 rounded-lg bg-slate-50 px-3 text-slate-400">
        <Search className="h-4 w-4" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search customers by name, email, or ID..."
          className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </label>
      <select
        value={role}
        onChange={(e) => onRoleChange(e.target.value)}
        className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none"
      >
        <option value="">All roles</option>
        <option value="customer">Customer</option>
        <option value="admin">Admin</option>
      </select>
    </div>
  );
});
