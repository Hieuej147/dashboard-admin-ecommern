import React from "react";
import { Sliders } from "lucide-react";

export const SettingsHeader = React.memo(function SettingsHeader() {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4 font-mono">
      <div>
        <div className="flex items-center gap-2.5">
          <span className="h-3 w-3 bg-[#ece945]" />
          <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-wider uppercase text-foreground">
            SYSTEM CONFIGURATION & DIAGNOSTICS
          </h1>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Environment parameters, MinIO S3 storage partitions, and microservice cluster health
        </p>
      </div>

      <div className="flex items-center gap-2">
        <span className="border border-border bg-card px-2.5 py-1 text-[11px] font-bold text-foreground flex items-center gap-1.5 shadow-hard-sm">
          <Sliders className="h-3.5 w-3.5 text-[#ece945]" />
          [ ADMINISTRATOR ACCESS ]
        </span>
      </div>
    </div>
  );
});
