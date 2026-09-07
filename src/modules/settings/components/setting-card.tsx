import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import type { SettingItem } from "../constants/settings-data";

interface SettingCardProps {
  setting: SettingItem;
}

export const SettingCard = React.memo(function SettingCard({
  setting,
}: SettingCardProps) {
  const Icon = setting.icon;

  return (
    <Card className="transition hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader>
        <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <Icon className="h-4 w-4" />
        </span>
        <CardTitle className="text-base">{setting.title}</CardTitle>
        <CardDescription>{setting.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <button
          type="button"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
        >
          {setting.value}
        </button>
      </CardContent>
    </Card>
  );
});
