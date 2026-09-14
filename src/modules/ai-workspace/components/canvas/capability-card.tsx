import { ArrowRight } from "lucide-react";
import type { CapabilityCardItem } from "../../types/ai-workspace.types";

interface CapabilityCardProps {
  card: CapabilityCardItem;
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

export function CapabilityCard({ card, onSelect, disabled }: CapabilityCardProps) {
  const Icon = card.icon;

  return (
    <div
      onClick={() => !disabled && onSelect(card.prompt)}
      className={`group flex flex-col justify-between rounded-none border border-border bg-card p-4 shadow-hard-sm transition font-mono ${
        disabled
          ? "opacity-40 cursor-not-allowed"
          : "hover:border-[#ece945] cursor-pointer"
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center border border-border bg-muted/40 text-foreground">
              <Icon className="h-3.5 w-3.5 text-[#ece945]" />
            </span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground group-hover:text-[#ece945] transition-colors">
              {card.title}
            </h3>
          </div>
          <span className="border border-border bg-muted/40 text-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-none uppercase">
            {card.badge}
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mt-1.5">
          {card.description}
        </p>
      </div>

      <div className="mt-3.5 flex items-center text-xs font-bold uppercase tracking-wider text-foreground group-hover:text-[#ece945] transition-colors">
        <span>EXECUTE ANALYSIS</span>
        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
      </div>
    </div>
  );
}
