import { Bot, CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import { autonomousDecisions } from "@/mock/dashboard-data";
import { cn } from "@/lib/utils";

const statusMap = {
  executed: { Icon: CheckCircle2, label: "Executed", tone: "bg-success/10 text-success" },
  pending: { Icon: Clock, label: "Pending", tone: "bg-warning/15 text-warning-foreground" },
  review: { Icon: ShieldCheck, label: "Awaiting review", tone: "bg-info/10 text-info" },
} as const;

export function AutonomousDecisions() {
  return (
    <div className="rounded-xl border border-border bg-surface shadow-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Autonomous Decisions</h3>
        </div>
        <span className="text-[11px] text-muted-foreground">last hour</span>
      </div>
      <div className="grid gap-3 p-5 md:grid-cols-2">
        {autonomousDecisions.map((d) => {
          const s = statusMap[d.status];
          return (
            <div key={d.id} className="rounded-lg border border-border bg-surface-muted/40 p-3.5 transition hover:border-primary/30 hover:bg-surface">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-semibold text-foreground">{d.title}</h4>
                <span className={cn("inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold", s.tone)}>
                  <s.Icon className="h-3 w-3" />
                  {s.label}
                </span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{d.description}</p>
              <div className="mt-3 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-gradient-primary" style={{ width: `${d.confidence}%` }} />
                  </div>
                  <span className="font-semibold text-foreground">{d.confidence}%</span>
                </div>
                <span className="text-muted-foreground">{d.timestamp}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
