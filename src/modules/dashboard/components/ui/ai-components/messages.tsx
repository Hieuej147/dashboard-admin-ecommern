import {
  CopilotChatAssistantMessage,
  CopilotChatUserMessage,
} from "@copilotkit/react-core/v2";
import type {
  CopilotChatAssistantMessageProps,
  CopilotChatUserMessageProps,
} from "@copilotkit/react-core/v2";

const AssistantBubbleImpl = (props: CopilotChatAssistantMessageProps) => (
  <CopilotChatAssistantMessage
    {...props}
    className="[&>div]:bg-slate-50 [&>div]:rounded-2xl [&>div]:rounded-tl-sm [&>div]:shadow-sm [&>div]:border [&>div]:border-slate-100 [&>div]:px-4 [&>div]:py-3"
  />
);
export const AssistantBubble = Object.assign(
  AssistantBubbleImpl,
  CopilotChatAssistantMessage,
);

const UserBubbleImpl = (props: CopilotChatUserMessageProps) => (
  <CopilotChatUserMessage
    {...props}
    className="[&>div]:bg-indigo-600 [&>div]:text-white [&>div]:rounded-2xl [&>div]:rounded-tr-sm [&>div]:shadow-md [&>div]:px-4 [&>div]:py-3"
  />
);
export const UserBubble = Object.assign(UserBubbleImpl, CopilotChatUserMessage);
export const ChatGPTThinking = () => (
  <div className="flex items-center gap-2 p-4 ml-2 animate-in fade-in duration-500">
    <div className="w-2.5 h-2.5 bg-slate-400 dark:bg-slate-300 rounded-full animate-thinking-dot" />
    <span className="text-xs text-slate-400 dark:text-slate-300 font-medium tracking-wide">
      Assistant is thinking...
    </span>
  </div>
);
