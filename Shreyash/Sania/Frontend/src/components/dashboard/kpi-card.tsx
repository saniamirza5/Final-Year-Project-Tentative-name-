import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { KpiMetric } from "@/types/dashboard";
import { cn } from "@/lib/utils";

export function KpiCard({ metric }: { metric: KpiMetric }) {
  const positive = metric.trend === "up";
  const Icon = metric.trend === "flat" ? Minus : positive ? ArrowUpRight : ArrowDownRight;
  const tone = metric.trend === "flat"
    ? "text-muted-foreground bg-muted"
    : positive
      ? "text-success bg-success/10"
      : "text-destructive bg-destructive/10";

  return (
    <div className="group rounded-xl border border-border bg-surface p-4 shadow-card transition hover:shadow-elevated hover:border-primary/30">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-muted-foreground">{metric.label}</p>
        <span className={cn("inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold", tone)}>
          <Icon className="h-3 w-3" />
          {Math.abs(metric.delta)}%
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">{metric.value}</p>
      {metric.hint && <p className="mt-1 text-[11px] text-muted-foreground">{metric.hint}</p>}
    </div>
  );
}
