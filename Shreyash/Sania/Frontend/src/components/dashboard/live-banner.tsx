import { Sparkles, Radio } from "lucide-react";

export function LiveBanner() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-surface shadow-card">
      <div className="absolute inset-0 bg-gradient-live" />
      <div className="absolute inset-0 shimmer opacity-60" />
      <div className="relative flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="live-dot" />
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Autonomous mode · Live
              </p>
            </div>
            <p className="mt-1 text-sm font-medium text-foreground md:text-base">
              AI is monitoring 1,284 shipments and 8,420 SKUs in real-time. 4 decisions executed in the last hour.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Radio className="h-3.5 w-3.5 text-success" />
            <span className="font-medium text-foreground">12 agents</span> online
          </div>
          <div className="hidden md:block h-4 w-px bg-border" />
          <div>
            Last update <span className="font-medium text-foreground">2s ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
