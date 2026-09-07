import { SettingsHeader, SettingsGrid, SystemDiagnosticsCard } from "../";

export default function SettingsPage() {
  return (
    <div className="flex max-w-4xl flex-col gap-6">
      <SettingsHeader />
      <SystemDiagnosticsCard />
      <SettingsGrid />
    </div>
  );
}
