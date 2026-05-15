import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { KpiGrid } from "@/components/dashboard/operations/kpi-grid";
import { MonthlyLogisticsPie } from "@/components/dashboard/operations/monthly-logistics-pie";
import { AIInsights } from "@/components/dashboard/ai-insights";
import { ActivityPanel } from "@/components/dashboard/activity-panel";
import { ShipmentTable } from "@/components/dashboard/shipment-table";
import { AutonomousDecisions } from "@/components/dashboard/autonomous-decisions";
import { ForecastChart } from "@/components/charts/forecast-chart";
import { aiInsightsExtended, overviewKpiMetrics } from "@/mock/dashboard-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Operations Overview · Nexus SCM" },
      { name: "description", content: "Control tower view of shipments, demand, and autonomous decisions." },
    ],
  }),
  component: Overview,
});

function Overview() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-10 pb-2">
      <PageHeader
        title="Operations Overview"
        description="Network health, demand signal, and exceptions in one place — updated as your systems refresh."
        actions={
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-sm border border-border/80 bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-border hover:bg-surface-muted"
          >
            <Download className="h-4 w-4 text-muted-foreground" />
            Export
          </button>
        }
      />

      <section className="space-y-3" aria-labelledby="overview-snapshot-heading">
        <h2
          id="overview-snapshot-heading"
          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Operational snapshot
        </h2>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-stretch">
          <div className="flex min-h-0 min-w-0 flex-1 basis-0 lg:min-h-[22rem]">
            <KpiGrid metrics={overviewKpiMetrics} className="h-full w-full min-h-[20rem] lg:min-h-0" />
          </div>
          <div className="flex min-h-0 min-w-0 flex-1 basis-0 lg:min-h-[22rem]">
            <MonthlyLogisticsPie className="h-full w-full min-h-[20rem] lg:min-h-0" />
          </div>
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="overview-forecast-heading">
        <h2 id="overview-forecast-heading" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Demand intelligence
        </h2>
        <ForecastChart height={400} />
      </section>

      <section className="space-y-3" aria-labelledby="overview-insights-heading">
        <h2 id="overview-insights-heading" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Insights & activity
        </h2>
        <div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
          <AIInsights variant="compact" insights={aiInsightsExtended} maxPreview={3} />
          <ActivityPanel variant="compact" previewCount={5} />
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="overview-shipments-heading">
        <h2 id="overview-shipments-heading" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Shipments
        </h2>
        <ShipmentTable />
      </section>

      <section aria-labelledby="overview-decisions-heading">
        <h2 id="overview-decisions-heading" className="sr-only">
          Autonomous decisions
        </h2>
        <AutonomousDecisions />
      </section>
    </div>
  );
}
