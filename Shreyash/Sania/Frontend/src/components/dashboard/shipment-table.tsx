import type { ShipmentRecord } from "@/types/prediction";
import { shipments as defaults } from "@/mock/shipment-data";
import { cn } from "@/lib/utils";
import { Truck } from "lucide-react";

const statusTone: Record<ShipmentRecord["status"], string> = {
  "On Time": "bg-success/10 text-success",
  Delivered: "bg-info/10 text-info",
  Delayed: "bg-warning/15 text-warning-foreground",
  "At Risk": "bg-destructive/10 text-destructive",
};

export function ShipmentTable({ data = defaults, title = "Active Shipments" }: { data?: ShipmentRecord[]; title?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface shadow-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        </div>
        <span className="text-[11px] text-muted-foreground">{data.length} shown · live ETA</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-muted text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-2.5 font-semibold">ID</th>
              <th className="px-5 py-2.5 font-semibold">Lane</th>
              <th className="px-5 py-2.5 font-semibold">Carrier</th>
              <th className="px-5 py-2.5 font-semibold">Status</th>
              <th className="px-5 py-2.5 font-semibold">ETA</th>
              <th className="px-5 py-2.5 font-semibold">Progress</th>
              <th className="px-5 py-2.5 font-semibold text-right">Risk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((s) => (
              <tr key={s.id} className="transition hover:bg-muted/40">
                <td className="px-5 py-3 font-mono text-xs text-foreground">{s.id}</td>
                <td className="px-5 py-3 text-xs text-foreground">
                  <span className="font-medium">{s.origin}</span>
                  <span className="mx-1.5 text-muted-foreground">→</span>
                  <span className="font-medium">{s.destination}</span>
                </td>
                <td className="px-5 py-3 text-xs text-muted-foreground">{s.carrier}</td>
                <td className="px-5 py-3">
                  <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", statusTone[s.status])}>
                    {s.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-xs text-muted-foreground">{s.eta}</td>
                <td className="px-5 py-3 w-40">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn("h-full rounded-full",
                          s.status === "At Risk" ? "bg-destructive" :
                          s.status === "Delayed" ? "bg-warning" : "bg-gradient-primary"
                        )}
                        style={{ width: `${s.progress}%` }}
                      />
                    </div>
                    <span className="w-9 text-right text-[11px] font-semibold text-foreground">{s.progress}%</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-right">
                  <span className={cn(
                    "text-xs font-semibold",
                    s.riskScore > 60 ? "text-destructive" :
                    s.riskScore > 30 ? "text-warning-foreground" : "text-success"
                  )}>
                    {s.riskScore}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
