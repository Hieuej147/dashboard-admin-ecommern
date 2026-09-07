import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MicroserviceCardProps {
  title: string;
  badge: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

export function MicroserviceCard({
  title,
  badge,
  description,
  icon: Icon,
  iconColor,
  iconBg,
}: MicroserviceCardProps) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}
        >
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="text-xs font-semibold text-slate-800">{title}</h3>
        <Badge
          variant="outline"
          className="ml-auto text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200"
        >
          {badge}
        </Badge>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}
