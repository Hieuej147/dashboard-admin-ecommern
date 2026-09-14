import { CopilotChat } from "@copilotkit/react-core/v2";
import { ChatStatusIndicator } from "./chat-status-indicator";
import { QuickPromptChips } from "./quick-prompt-chips";
import {
  CHAT_MESSAGE_VIEW,
  CHAT_SUGGESTION_VIEW,
  CHAT_INPUT,
  CHAT_LABELS,
} from "../../constants/chat-config";

interface ChatPanelProps {
  activeThreadId: string | null;
  isRunning: boolean;
  onSendPrompt: (prompt: string) => void;
}

export function ChatPanel({
  activeThreadId,
  isRunning,
  onSendPrompt,
}: ChatPanelProps) {
  return (
    <div className="flex w-full md:w-[440px] xl:w-[480px] shrink-0 flex-col rounded-none border border-border dark:border-white/10 bg-card dark:bg-[#0e1013] shadow-hard-sm overflow-hidden font-mono transition-colors">
      {/* Header status bar */}
      <ChatStatusIndicator isRunning={isRunning} />

      {/* Quick suggestions/prompts */}
      <QuickPromptChips onSelectPrompt={onSendPrompt} disabled={isRunning} />

      {/* Embedded CopilotChat with smooth threadId switching */}
      <div className="flex-1 min-h-0 flex flex-col bg-background dark:bg-[#0b0d0f] overflow-hidden">
        <CopilotChat
          key={activeThreadId || "empty"}
          threadId={activeThreadId ?? undefined}
          className="h-full flex flex-col overflow-hidden"
          messageView={CHAT_MESSAGE_VIEW}
          suggestionView={CHAT_SUGGESTION_VIEW}
          input={CHAT_INPUT}
          scrollView="bg-background dark:bg-[#0b0d0f] px-3 py-2 flex-1 overflow-y-auto font-mono"
          disclaimer="text-[10px] text-muted-foreground text-center py-1.5 font-mono uppercase tracking-wider"
          labels={CHAT_LABELS}
        />
      </div>
    </div>
  );
}
