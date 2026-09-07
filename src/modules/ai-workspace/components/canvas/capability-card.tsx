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
      className={`group flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs transition ${
        disabled
          ? "opacity-60 cursor-not-allowed"
          : "hover:border-blue-300 hover:shadow-md cursor-pointer"
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${card.accent} border`}
            >
              <Icon className="h-3.5 w-3.5" />
            </span>
            <h3 className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 transition">
              {card.title}
            </h3>
          </div>
          <span
            className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${card.badgeColor}`}
          >
            {card.badge}
          </span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
          {card.description}
        </p>
      </div>

      <div className="mt-3.5 flex items-center text-xs font-medium text-blue-600 group-hover:translate-x-0.5 transition-transform">
        <span>Chạy phân tích ngay</span>
        <ArrowRight className="ml-1 h-3.5 w-3.5" />
      </div>
    </div>
  );
}
