import {
  Area, AreaChart, CartesianGrid, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { forecastSeries } from "@/mock/forecast-data";

const tooltipStyle = {
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: 8,
  fontSize: 12,
  boxShadow: "var(--shadow-elevated)",
};

export function ForecastChart({ height = 300 }: { height?: number }) {
  return (
    <div className="rounded-xl border border-border bg-surface shadow-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Demand Forecast — 10-week horizon</h3>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Actuals + AI forecast with 90% confidence band</p>
        </div>
        <span className="text-[11px] font-semibold text-success">94.1% accuracy</span>
      </div>
      <div className="p-3" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={forecastSeries} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="bandGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.18} />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="period" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} width={40} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area type="monotone" dataKey="upper" stroke="none" fill="url(#bandGrad)" name="Upper band" />
            <Area type="monotone" dataKey="lower" stroke="none" fill="var(--color-surface)" name="Lower band" />
            <Line type="monotone" dataKey="actual" stroke="var(--color-foreground)" strokeWidth={2} dot={{ r: 3 }} name="Actual" />
            <Line type="monotone" dataKey="forecast" stroke="var(--color-primary)" strokeWidth={2.5} strokeDasharray="5 4" dot={false} name="Forecast" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
