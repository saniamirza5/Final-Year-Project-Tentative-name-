export interface ForecastPoint {
  period: string;
  actual: number | null;
  forecast: number;
  upper: number;
  lower: number;
}

export interface RiskPoint {
  category: string;
  probability: number;
  impact: number;
  exposure: number;
}

export interface ShipmentRecord {
  id: string;
  origin: string;
  destination: string;
  carrier: string;
  status: "On Time" | "Delayed" | "Delivered" | "At Risk";
  eta: string;
  progress: number;
  riskScore: number;
}
