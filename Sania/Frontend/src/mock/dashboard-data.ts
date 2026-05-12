import type {
  ActivityEvent,
  AIInsight,
  AutonomousDecision,
  KpiMetric,
  WarehouseUtil,
} from "@/types/dashboard";

export const kpiMetrics: KpiMetric[] = [
  { id: "k1", label: "On-Time Delivery", value: "97.4%", delta: 1.8, trend: "up", hint: "vs last 7d" },
  { id: "k2", label: "Forecast Accuracy", value: "94.1%", delta: 0.6, trend: "up", hint: "MAPE 5.9%" },
  { id: "k3", label: "Inventory Turns", value: "8.2x", delta: -0.3, trend: "down", hint: "rolling 30d" },
  { id: "k4", label: "Active Shipments", value: "1,284", delta: 4.2, trend: "up", hint: "12 at risk" },
  { id: "k5", label: "Cost per Order", value: "$12.48", delta: -2.1, trend: "up", hint: "AI optimized" },
  { id: "k6", label: "AI Decisions / hr", value: "342", delta: 11.5, trend: "up", hint: "autonomous" },
];

export const activityFeed: ActivityEvent[] = [
  { id: "a1", timestamp: "2m ago", agent: "ForecastAgent", action: "Re-trained demand model for Region EU-West (+2.1% accuracy)", status: "success" },
  { id: "a2", timestamp: "6m ago", agent: "RiskAgent", action: "Flagged supplier ACME-2241 — lead time variance > 3σ", status: "warning" },
  { id: "a3", timestamp: "11m ago", agent: "InventoryAgent", action: "Auto-generated PO #44120 for SKU-882 (Critical)", status: "info" },
  { id: "a4", timestamp: "18m ago", agent: "RouteAgent", action: "Re-routed 14 shipments around weather disruption (NA-Central)", status: "success" },
  { id: "a5", timestamp: "27m ago", agent: "AnomalyAgent", action: "Detected unusual draw on SKU-1042 (Boston DC)", status: "warning" },
  { id: "a6", timestamp: "41m ago", agent: "PricingAgent", action: "Adjusted carrier mix — saved $4,820 on lane LAX→DFW", status: "success" },
];

export const aiInsights: AIInsight[] = [
  { id: "i1", title: "Demand surge expected — North America", summary: "Model projects +18% lift in SKU-330 family over the next 14 days. Pre-position 2 truckloads to Dallas.", impact: "High", confidence: 92, category: "Demand" },
  { id: "i2", title: "Supplier risk rising — ACME-2241", summary: "Lead time drift + financial signal degradation. Recommend dual-sourcing 30% volume to Vendor B.", impact: "High", confidence: 87, category: "Risk" },
  { id: "i3", title: "Overstock detected — EU warehouses", summary: "12 SKUs sit 38 days above target. Promotional reallocation could free $214K working capital.", impact: "Medium", confidence: 81, category: "Inventory" },
];

export const autonomousDecisions: AutonomousDecision[] = [
  { id: "d1", title: "Auto-replenish SKU-882", description: "Issued PO for 4,200 units to Vendor B based on 14-day demand projection.", confidence: 94, status: "executed", timestamp: "11m ago" },
  { id: "d2", title: "Re-route 14 shipments", description: "Switched carrier from Lane-A to Lane-C to bypass weather event in NA-Central.", confidence: 89, status: "executed", timestamp: "18m ago" },
  { id: "d3", title: "Promote overstock — EU", description: "Recommended 8% markdown on 12 SKUs awaiting human approval.", confidence: 76, status: "review", timestamp: "32m ago" },
  { id: "d4", title: "Hold PO #44102", description: "Paused order — supplier risk score crossed threshold. Awaiting analyst review.", confidence: 72, status: "pending", timestamp: "1h ago" },
];

export const warehouseUtilization: WarehouseUtil[] = [
  { id: "w1", name: "Dallas DC", region: "NA-Central", utilization: 82, capacity: 120000 },
  { id: "w2", name: "Newark DC", region: "NA-East", utilization: 67, capacity: 95000 },
  { id: "w3", name: "LAX Hub", region: "NA-West", utilization: 91, capacity: 140000 },
  { id: "w4", name: "Rotterdam", region: "EU-West", utilization: 74, capacity: 180000 },
  { id: "w5", name: "Singapore", region: "APAC", utilization: 88, capacity: 160000 },
];
