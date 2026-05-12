import { Bell, Search, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-surface/80 px-5 backdrop-blur-md">
      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search SKUs, shipments, suppliers, agents…"
          className="h-9 pl-9 bg-surface-muted border-transparent focus-visible:bg-surface"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-2 rounded-full border border-border bg-surface-muted px-3 py-1.5">
          <span className="live-dot" />
          <span className="text-xs font-medium text-foreground">Live · Global</span>
        </div>
        <button className="relative flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-muted-foreground hover:text-foreground transition">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-destructive" />
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-muted-foreground hover:text-foreground transition">
          <Settings className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2 pl-3 border-l border-border">
          <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-semibold text-primary-foreground">
            AK
          </div>
          <div className="hidden md:block leading-tight">
            <p className="text-xs font-semibold text-foreground">Alex Kim</p>
            <p className="text-[10px] text-muted-foreground">Ops Director</p>
          </div>
        </div>
      </div>
    </header>
  );
}
