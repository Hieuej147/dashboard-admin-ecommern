import { Bot } from "lucide-react";

interface ChatStatusIndicatorProps {
  isRunning: boolean;
}

export function ChatStatusIndicator({ isRunning }: ChatStatusIndicatorProps) {
  return (
    <div className="flex items-center justify-between border-b border-border dark:border-white/10 px-3.5 py-2.5 bg-muted/40 dark:bg-[#121418] shrink-0 font-mono text-foreground transition-colors">
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center border border-border dark:border-white/10 bg-card dark:bg-[#16191f] text-foreground shadow-hard-sm">
          <Bot className="h-3.5 w-3.5 text-[#ece945]" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-foreground dark:text-zinc-100">
            AI COPILOT AGENT
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {isRunning ? "[ EXECUTING QUERY & TELEMETRY... ]" : "[ STATUS: READY FOR DIRECTIVES ]"}
          </p>
        </div>
      </div>
      {isRunning && (
        <span className="border border-[#ece945]/50 bg-[#ece945]/10 px-2 py-0.5 text-[10px] font-bold text-foreground dark:text-[#ece945] flex items-center gap-1.5 shadow-hard-sm">
          <span className="h-1.5 w-1.5 bg-[#ece945] animate-pulse shrink-0 shadow-[0_0_4px_rgba(236,233,69,0.8)]" />
          [ GENERATING ]
        </span>
      )}
    </div>
  );
}
