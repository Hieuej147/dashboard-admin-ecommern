import React from "react";
import type { SettingItem } from "../constants/settings-data";
import { toast } from "@/components/ui/toast";

interface SettingCardProps {
  setting: SettingItem;
}

export const SettingCard = React.memo(function SettingCard({
  setting,
}: SettingCardProps) {
  const Icon = setting.icon;

  return (
    <div className="border border-border bg-card p-4 shadow-hard-sm font-mono flex flex-col justify-between transition-colors">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center border border-border bg-muted/40 text-foreground">
            <Icon className="h-3.5 w-3.5" />
          </div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
            {setting.title}
          </h4>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed mt-2">
          {setting.description}
        </p>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => toast.info(`[ CONFIG ] ${setting.title}: ${setting.value}`)}
          className="w-full border border-border bg-muted/20 px-3 py-2 text-left text-[11px] font-bold text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          [ {setting.value} ]
        </button>
      </div>
    </div>
  );
});
