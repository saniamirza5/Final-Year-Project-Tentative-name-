import { Sparkles, AlertTriangle, Boxes, Truck } from "lucide-react";
import type { AIInsight } from "@/types/dashboard";
import { aiInsights as defaults } from "@/mock/dashboard-data";
import { cn } from "@/lib/utils";

const iconFor = {
  Demand: Sparkles,
  Risk: AlertTriangle,
  Inventory: Boxes,
  Logistics: Truck,
} as const;

const impactTone = {
  High: "bg-destructive/10 text-destructive border-destructive/20",
  Medium: "bg-warning/15 text-warning-foreground border-warning/30",
  Low: "bg-info/10 text-info border-info/20",
} as const;

export function AIInsights({ insights = defaults }: { insights?: AIInsight[] }) {
  return (
    <div className="rounded-xl border border-border bg-surface shadow-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">AI Insights</h3>
        </div>
        <span className="text-[11px] text-muted-foreground">Updated just now</span>
      </div>
      <div className="divide-y divide-border">
        {insights.map((i) => {
          const Icon = iconFor[i.category];
          return (
            <div key={i.id} className="group p-4 transition hover:bg-muted/40">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-semibold text-foreground">{i.title}</h4>
                    <span className={cn("rounded-full border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide", impactTone[i.impact])}>
                      {i.impact}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{i.summary}</p>
                  <div className="mt-2.5 flex items-center gap-2">
                    <div className="h-1.5 flex-1 max-w-[120px] overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-gradient-primary" style={{ width: `${i.confidence}%` }} />
                    </div>
                    <span className="text-[11px] font-semibold text-foreground">{i.confidence}%</span>
                    <span className="text-[10px] text-muted-foreground">confidence</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
