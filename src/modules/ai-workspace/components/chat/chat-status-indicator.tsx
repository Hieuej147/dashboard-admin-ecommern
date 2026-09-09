import { Bot } from "lucide-react";

interface ChatStatusIndicatorProps {
  isRunning: boolean;
}

export function ChatStatusIndicator({ isRunning }: ChatStatusIndicatorProps) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5 bg-slate-50/70 shrink-0">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
          <Bot className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-800">
            AI Assistant Chat
          </p>
          <p className="text-[10px] text-slate-400">
            {isRunning ? "Processing and generating..." : "Ready for instructions"}
          </p>
        </div>
      </div>
      {isRunning && (
        <span className="flex items-center gap-1.5 text-[11px] text-blue-600 font-medium">
          <span className="h-2 w-2 rounded-full bg-blue-600 animate-ping" />
          Generating
        </span>
      )}
    </div>
  );
}
