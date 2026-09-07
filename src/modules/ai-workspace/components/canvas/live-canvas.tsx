import { CanvasEmptyShowcase } from "./canvas-empty-showcase";

interface LiveCanvasProps {
  hasActiveDashboard: boolean;
  onSelectPrompt: (prompt: string) => void;
  isRunning?: boolean;
}

export function LiveCanvas({
  hasActiveDashboard,
  onSelectPrompt,
  isRunning,
}: LiveCanvasProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* A2UI Portal Mount Target */}
      <div
        id="dashboard-root"
        className="w-full flex flex-col gap-6 empty:hidden"
      />

      {/* When no dynamic A2UI dashboard is generated, display the showcase */}
      {!hasActiveDashboard && (
        <CanvasEmptyShowcase
          onSelectPrompt={onSelectPrompt}
          isRunning={isRunning}
        />
      )}
    </div>
  );
}
