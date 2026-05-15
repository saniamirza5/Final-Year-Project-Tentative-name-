import type { RiskPoint } from "@/types/prediction";

export const riskMatrix: RiskPoint[] = [
  { category: "Supplier Default", probability: 28, impact: 82, exposure: 64 },
  { category: "Port Congestion", probability: 54, impact: 58, exposure: 71 },
  { category: "Demand Shock", probability: 38, impact: 74, exposure: 60 },
  { category: "Weather Disruption", probability: 46, impact: 52, exposure: 48 },
  { category: "Customs Delay", probability: 62, impact: 38, exposure: 44 },
  { category: "Cyber Incident", probability: 18, impact: 88, exposure: 56 },
  { category: "Currency Volatility", probability: 50, impact: 44, exposure: 40 },
];

export const riskTrend = [
  { week: "W1", risk: 42 },
  { week: "W2", risk: 47 },
  { week: "W3", risk: 51 },
  { week: "W4", risk: 49 },
  { week: "W5", risk: 55 },
  { week: "W6", risk: 58 },
  { week: "W7", risk: 54 },
  { week: "W8", risk: 60 },
];
