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
    <div className="flex flex-col gap-2.5 border-b border-border bg-card p-3 sm:flex-row font-mono select-none">
      <div className="flex flex-1 items-center gap-2 border border-border bg-muted/30 px-3 text-muted-foreground focus-within:border-foreground">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search customers by name, email, or user ID..."
          className="h-9 w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex items-center gap-2">
        <select
          value={role}
          onChange={(e) => onRoleChange(e.target.value)}
          className="h-9 border border-border bg-card px-3 text-xs font-bold uppercase tracking-wider text-foreground outline-none focus:border-foreground cursor-pointer"
        >
          <option value="">ALL ROLES</option>
          <option value="customer">CUSTOMER</option>
          <option value="admin">ADMINISTRATOR</option>
        </select>
      </div>
    </div>
  );
});
