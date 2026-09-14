import {
  CopilotChatAssistantMessage,
  CopilotChatUserMessage,
} from "@copilotkit/react-core/v2";
import type {
  CopilotChatAssistantMessageProps,
  CopilotChatUserMessageProps,
} from "@copilotkit/react-core/v2";

const AssistantBubbleImpl = (props: CopilotChatAssistantMessageProps) => (
  <div className="border border-border dark:border-white/10 dark:border-l-2 dark:border-l-[#ece945] bg-card dark:bg-[#13161a] text-foreground dark:text-zinc-200 p-3.5 shadow-hard-sm dark:shadow-[2px_2px_0px_0px_rgba(236,233,69,0.15)] font-mono text-xs my-2.5 transition-colors">
    <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-border dark:border-white/10 text-[10px] uppercase font-bold text-muted-foreground">
      <div className="flex items-center gap-1.5 text-foreground dark:text-[#ece945]">
        <span className="h-2 w-2 bg-[#ece945] shadow-[0_0_6px_rgba(236,233,69,0.7)] shrink-0" />
        <span className="tracking-wider">[ AI COPILOT ]</span>
      </div>
      <span className="text-[9px] text-muted-foreground/70 dark:text-zinc-500 tracking-wider">
        AUTONOMOUS INTELLIGENCE
      </span>
    </div>
    <CopilotChatAssistantMessage
      {...props}
      className="[&>div]:!bg-transparent [&>div]:!p-0 [&>div]:!border-0 [&>div]:!shadow-none [&>div]:!rounded-none text-foreground dark:text-zinc-200 leading-relaxed [&_p]:my-1.5 [&_ul]:my-2 [&_ul]:pl-4 [&_ul]:list-disc [&_ol]:my-2 [&_ol]:pl-4 [&_ol]:list-decimal [&_li]:my-1 [&_strong]:text-foreground [&_strong]:dark:text-[#ece945] [&_code]:bg-muted dark:[&_code]:bg-black/70 dark:[&_code]:text-[#ece945] dark:[&_code]:border dark:[&_code]:border-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_a]:text-[#ece945] [&_a]:underline"
    />
  </div>
);

export const AssistantBubble = Object.assign(
  AssistantBubbleImpl,
  CopilotChatAssistantMessage,
);

const UserBubbleImpl = (props: CopilotChatUserMessageProps) => (
  <div className="border border-border dark:border-white/15 bg-muted/50 dark:bg-[#181c22] text-foreground dark:text-zinc-100 p-3 font-mono text-xs my-2.5 max-w-[88%] ml-auto shadow-hard-sm dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.08)] transition-colors">
    <div className="flex items-center gap-1.5 pb-1.5 mb-1.5 border-b border-border/60 dark:border-white/10 text-[10px] uppercase font-bold text-muted-foreground dark:text-zinc-400 justify-end">
      <span>[ ADMINISTRATOR ]</span>
      <span className="h-1.5 w-1.5 bg-foreground dark:bg-zinc-300 shrink-0" />
    </div>
    <CopilotChatUserMessage
      {...props}
      className="[&>div]:!bg-transparent [&>div]:!p-0 [&>div]:!border-0 [&>div]:!shadow-none [&>div]:!rounded-none text-foreground dark:text-zinc-100 leading-relaxed font-mono"
    />
  </div>
);

export const UserBubble = Object.assign(UserBubbleImpl, CopilotChatUserMessage);

export const ChatGPTThinking = () => (
  <div className="flex items-center gap-2.5 p-3 font-mono text-xs text-foreground border border-border dark:border-[#ece945]/40 bg-card dark:bg-[#13161a] shadow-hard-sm dark:shadow-[2px_2px_0px_0px_rgba(236,233,69,0.2)] my-2.5">
    <span className="h-2 w-2 bg-[#ece945] shadow-[0_0_8px_rgba(236,233,69,0.8)] animate-ping shrink-0" />
    <span className="font-bold text-[11px] tracking-wider uppercase text-foreground dark:text-[#ece945]">
      [ COPILOT ANALYZING COMMAND & CONNECTING SERVICES... ]
    </span>
  </div>
);
