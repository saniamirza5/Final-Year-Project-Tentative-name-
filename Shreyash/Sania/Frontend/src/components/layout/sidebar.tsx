import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Boxes,
  TrendingUp,
  ShieldAlert,
  Truck,
  Sparkles,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "Inventory", url: "/inventory", icon: Boxes },
  { title: "Forecasting", url: "/forecasting", icon: TrendingUp },
  { title: "Risk Analysis", url: "/risk-analysis", icon: ShieldAlert },
  { title: "Shipments", url: "/shipments", icon: Truck },
  { title: "AI Assistant", url: "/ai-assistant", icon: Sparkles },
] as const;

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-sidebar-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-primary shadow-glow">
          <Activity className="h-4.5 w-4.5 text-primary-foreground" strokeWidth={2.5} />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-sidebar-foreground">Nexus SCM</p>
          <p className="text-[11px] text-muted-foreground">Autonomous Supply Cloud</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-0.5">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Operations
        </p>
        {items.map((item) => {
          const active = pathname === item.url;
          const Icon = item.icon;
          return (
            <Link
              key={item.url}
              to={item.url}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
              <span>{item.title}</span>
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
            </Link>
          );
        })}
      </nav>

      <div className="m-3 rounded-lg border border-sidebar-border bg-gradient-surface p-3">
        <div className="flex items-center gap-2">
          <span className="live-dot" />
          <p className="text-xs font-semibold text-sidebar-foreground">All systems live</p>
        </div>
        <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">
          12 agents online · 342 decisions / hr · 0 incidents
        </p>
      </div>
    </aside>
  );
}
