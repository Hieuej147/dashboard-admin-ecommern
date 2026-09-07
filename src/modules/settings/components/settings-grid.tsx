import React from "react";
import { SETTINGS_ITEMS } from "../constants/settings-data";
import { SettingCard } from "./setting-card";

export const SettingsGrid = React.memo(function SettingsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {SETTINGS_ITEMS.map((setting) => (
        <SettingCard key={setting.title} setting={setting} />
      ))}
    </div>
  );
});
