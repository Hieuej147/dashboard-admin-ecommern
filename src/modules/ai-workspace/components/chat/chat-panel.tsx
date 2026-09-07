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
    <div className="flex w-full md:w-[440px] xl:w-[480px] shrink-0 flex-col rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
      {/* Header status bar */}
      <ChatStatusIndicator isRunning={isRunning} />

      {/* Quick suggestions/prompts */}
      <QuickPromptChips onSelectPrompt={onSendPrompt} disabled={isRunning} />

      {/* Embedded CopilotChat with smooth threadId switching */}
      <div className="flex-1 min-h-0 flex flex-col bg-white overflow-hidden">
        <CopilotChat
          key={activeThreadId || "empty"}
          threadId={activeThreadId ?? undefined}
          className="h-full flex flex-col overflow-hidden"
          messageView={CHAT_MESSAGE_VIEW}
          suggestionView={CHAT_SUGGESTION_VIEW}
          input={CHAT_INPUT}
          scrollView="bg-slate-50/40 px-3 py-3 flex-1 overflow-y-auto"
          disclaimer="text-[11px] text-slate-400 text-center py-1.5"
          labels={CHAT_LABELS}
        />
      </div>
    </div>
  );
}
