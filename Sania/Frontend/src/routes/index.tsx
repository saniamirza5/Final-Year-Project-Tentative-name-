import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/page-header";
import { LiveBanner } from "@/components/dashboard/live-banner";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { AIInsights } from "@/components/dashboard/ai-insights";
import { ActivityPanel } from "@/components/dashboard/activity-panel";
import { ShipmentTable } from "@/components/dashboard/shipment-table";
import { WarehouseUtilization } from "@/components/dashboard/warehouse-utilization";
import { AutonomousDecisions } from "@/components/dashboard/autonomous-decisions";
import { AIConfidence } from "@/components/dashboard/ai-confidence";
import { ForecastChart } from "@/components/charts/forecast-chart";
import { kpiMetrics } from "@/mock/dashboard-data";
import { Download, Filter } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Operations Overview · Nexus SCM" },
      { name: "description", content: "Executive AI operations dashboard for autonomous supply chain monitoring." },
    ],
  }),
  component: Overview,
});

function Overview() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Live Operations"
        title="Operations Overview"
        description="Real-time visibility across your global supply chain — powered by 12 autonomous AI agents."
        actions={
          <>
            <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
              <Filter className="h-3.5 w-3.5" /> Filters
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-md bg-gradient-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-card hover:shadow-glow">
              <Download className="h-3.5 w-3.5" /> Export report
            </button>
          </>
        }
      />

      <LiveBanner />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {kpiMetrics.map((m) => <KpiCard key={m.id} metric={m} />)}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <ForecastChart />
          <AutonomousDecisions />
          <ShipmentTable />
        </div>
        <div className="space-y-6">
          <AIInsights />
          <AIConfidence />
          <WarehouseUtilization />
          <ActivityPanel />
        </div>
      </div>
    </div>
  );
}
