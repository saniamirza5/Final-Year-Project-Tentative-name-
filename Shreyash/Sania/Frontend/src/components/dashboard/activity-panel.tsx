import { CheckCircle2, AlertTriangle, Info, XCircle, Activity } from "lucide-react";
import type { ActivityEvent } from "@/types/dashboard";
import { activityFeed as defaults } from "@/mock/dashboard-data";
import { cn } from "@/lib/utils";

const styles = {
  success: { Icon: CheckCircle2, dot: "bg-success", text: "text-success" },
  warning: { Icon: AlertTriangle, dot: "bg-warning", text: "text-warning-foreground" },
  info: { Icon: Info, dot: "bg-info", text: "text-info" },
  error: { Icon: XCircle, dot: "bg-destructive", text: "text-destructive" },
} as const;

export function ActivityPanel({ events = defaults }: { events?: ActivityEvent[] }) {
  return (
    <div className="rounded-xl border border-border bg-surface shadow-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Live Agent Activity</h3>
        </div>
        <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="live-dot" /> streaming
        </span>
      </div>
      <ol className="relative px-5 py-4">
        <span className="absolute left-[26px] top-4 bottom-4 w-px bg-border" />
        {events.map((e) => {
          const s = styles[e.status];
          return (
            <li key={e.id} className="relative pl-8 pb-4 last:pb-0">
              <span className={cn("absolute left-[18px] top-1.5 h-2 w-2 rounded-full ring-4 ring-surface", s.dot)} />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    {e.agent} <span className={cn("ml-1 font-medium", s.text)}>•</span>
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{e.action}</p>
                </div>
                <span className="shrink-0 text-[10px] text-muted-foreground">{e.timestamp}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
