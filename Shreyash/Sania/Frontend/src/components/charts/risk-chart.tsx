import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell,
} from "recharts";
import { riskMatrix } from "@/mock/risk-data";

const tooltipStyle = {
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: 8,
  fontSize: 12,
  boxShadow: "var(--shadow-elevated)",
};

function colorFor(v: number) {
  if (v > 60) return "var(--color-destructive)";
  if (v > 45) return "var(--color-warning)";
  return "var(--color-primary)";
}

export function RiskChart({ height = 320 }: { height?: number }) {
  return (
    <div className="rounded-xl border border-border bg-surface shadow-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Risk Exposure by Category</h3>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Probability × impact, scored 0–100</p>
        </div>
        <span className="text-[11px] text-muted-foreground">7 categories monitored</span>
      </div>
      <div className="p-3" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={riskMatrix} layout="vertical" margin={{ top: 10, right: 16, left: 16, bottom: 0 }}>
            <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <YAxis dataKey="category" type="category" tick={{ fontSize: 11, fill: "var(--color-foreground)" }} axisLine={false} tickLine={false} width={130} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="exposure" radius={[0, 6, 6, 0]} barSize={18}>
              {riskMatrix.map((r) => <Cell key={r.category} fill={colorFor(r.exposure)} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
