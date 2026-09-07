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
    <div className="flex items-center gap-1.5 border-b border-slate-100 bg-white/70 px-2.5 py-1.5 shrink-0">
      {/* Label */}
      <span className="text-[10px] uppercase font-semibold text-slate-400 shrink-0 flex items-center gap-1 pl-0.5">
        <Sparkles className="w-3 h-3 text-amber-500" />
        Gợi ý:
      </span>

      {/* Optional Left Scroll Arrow */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scrollBy(-140)}
          className="h-5 w-5 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 shrink-0 transition"
          aria-label="Cuộn sang trái"
        >
          <ChevronLeft className="h-3 w-3" />
        </button>
      )}

      {/* Horizontal Scroll Area with visible styled scrollbar */}
      <div
        ref={scrollRef}
        onWheel={handleWheel}
        className="flex-1 flex items-center gap-1.5 overflow-x-auto py-1 scroll-smooth min-w-0 [scrollbar-width:thin] [scrollbar-color:rgba(148,163,184,0.45)_transparent]"
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
                className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50/70 px-2.5 py-1 text-[11px] font-medium text-blue-700 hover:border-blue-400 hover:bg-blue-100 transition shrink-0 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:border-blue-300 hover:bg-blue-50/70 hover:text-blue-700 transition shrink-0 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon className="h-3 w-3 text-slate-400" />
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
          className="h-5 w-5 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 shrink-0 transition"
          aria-label="Cuộn sang phải"
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
        title="Tải lại gợi ý"
        className="rounded-md p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition shrink-0 disabled:opacity-40"
      >
        <RefreshCw
          className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-blue-600" : ""}`}
        />
      </button>
    </div>
  );
}
