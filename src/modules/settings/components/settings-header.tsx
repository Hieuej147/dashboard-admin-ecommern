import React from "react";

export const SettingsHeader = React.memo(function SettingsHeader() {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-500">
        System
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
        Settings
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Shape how your admin workspace behaves.
      </p>
    </div>
  );
});
