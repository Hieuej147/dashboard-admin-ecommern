import type { LucideIcon } from "lucide-react";

interface MicroserviceCardProps {
  title: string;
  badge: string;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
}

export function MicroserviceCard({
  title,
  badge,
  description,
  icon: Icon,
}: MicroserviceCardProps) {
  return (
    <div className="border border-border bg-card p-4 shadow-hard-sm font-mono rounded-none">
      <div className="flex items-center gap-2 mb-2">
        <span className="flex h-7 w-7 items-center justify-center border border-border bg-muted/40 text-foreground">
          <Icon className="h-3.5 w-3.5 text-[#ece945]" />
        </span>
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">{title}</h3>
        <span className="ml-auto border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded-none uppercase">
          [ {badge} ]
        </span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed mt-1">{description}</p>
    </div>
  );
}
