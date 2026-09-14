import React, { useRef, useState, useEffect, useCallback } from "react";
import { Sparkles, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { useSuggestions } from "@copilotkit/react-core/v2";
import { QUICK_PROMPT_CHIPS } from "../../constants/quick-prompts";

interface QuickPromptChipsProps {
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

export function QuickPromptChips({
  onSelectPrompt,
  disabled,
}: QuickPromptChipsProps) {
  const { suggestions, reloadSuggestions, isLoading } = useSuggestions({
    agentId: "dashboard",
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll, suggestions]);

  const scrollBy = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  // Enable mouse wheel scrolling horizontally
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY !== 0 && scrollRef.current) {
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <div className="flex items-center gap-1.5 border-b border-border dark:border-white/10 bg-card dark:bg-[#121418] px-3 py-1.5 shrink-0 font-mono transition-colors">
      {/* Label */}
      <span className="text-[10px] uppercase font-bold text-muted-foreground dark:text-zinc-400 shrink-0 flex items-center gap-1 pl-0.5">
        <Sparkles className="w-3 h-3 text-[#ece945]" />
        PROMPTS:
      </span>

      {/* Optional Left Scroll Arrow */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scrollBy(-140)}
          className="h-5 w-5 rounded-none bg-card dark:bg-[#181b20] shadow-hard-sm border border-border dark:border-white/10 flex items-center justify-center text-foreground hover:bg-muted shrink-0 transition cursor-pointer"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-3 w-3" />
        </button>
      )}

      {/* Horizontal Scroll Area with visible styled scrollbar */}
      <div
        ref={scrollRef}
        onWheel={handleWheel}
        className="flex-1 flex items-center gap-1.5 overflow-x-auto py-1 scroll-smooth min-w-0 [scrollbar-width:thin]"
      >
        {/* Dynamic Suggestions from CopilotKit v2 hook */}
        {suggestions && suggestions.length > 0
          ? suggestions.map((s, idx) => (
              <button
                key={`sugg-${idx}`}
                type="button"
                disabled={disabled}
                onClick={() => onSelectPrompt(s.message)}
                title={s.message}
                className="inline-flex items-center gap-1 rounded-none border border-border dark:border-white/10 bg-muted/40 dark:bg-[#181b20] px-2.5 py-1 text-[11px] font-bold text-foreground dark:text-zinc-200 hover:bg-muted hover:border-[#ece945] dark:hover:border-[#ece945] dark:hover:text-[#ece945] transition-colors shrink-0 whitespace-nowrap shadow-hard-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>{s.title}</span>
              </button>
            ))
          : QUICK_PROMPT_CHIPS.map((chip, idx) => {
              const Icon = chip.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={disabled}
                  onClick={() => onSelectPrompt(chip.prompt)}
                  className="inline-flex items-center gap-1 rounded-none border border-border dark:border-white/10 bg-muted/40 dark:bg-[#181b20] px-2.5 py-1 text-[11px] font-bold text-foreground dark:text-zinc-200 hover:bg-muted hover:border-[#ece945] dark:hover:border-[#ece945] dark:hover:text-[#ece945] transition-colors shrink-0 whitespace-nowrap shadow-hard-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Icon className="h-3 w-3 text-[#ece945]" />
                  {chip.label}
                </button>
              );
            })}
      </div>

      {/* Optional Right Scroll Arrow */}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scrollBy(140)}
          className="h-5 w-5 rounded-none bg-card dark:bg-[#181b20] shadow-hard-sm border border-border dark:border-white/10 flex items-center justify-center text-foreground hover:bg-muted shrink-0 transition cursor-pointer"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-3 w-3" />
        </button>
      )}

      {/* Fixed Reload button */}
      <button
        type="button"
        disabled={disabled || isLoading}
        onClick={() => {
          if (!disabled && !isLoading) {
            reloadSuggestions();
          }
        }}
        title="Reload prompt suggestions"
        className="rounded-none border border-border dark:border-white/10 bg-card dark:bg-[#181b20] p-1 text-foreground hover:bg-muted transition shrink-0 disabled:opacity-40 cursor-pointer shadow-hard-sm"
      >
        <RefreshCw
          className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#ece945]" : ""}`}
        />
      </button>
    </div>
  );
}
