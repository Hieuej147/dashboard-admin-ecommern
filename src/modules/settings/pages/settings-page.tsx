import { SettingsHeader, SettingsGrid, SystemDiagnosticsCard } from "../";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 font-mono">
      <SettingsHeader />
      <SystemDiagnosticsCard />
      <SettingsGrid />
    </div>
  );
}
