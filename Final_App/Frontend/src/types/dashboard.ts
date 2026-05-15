export interface KpiMetric {
  id: string;
  label: string;
  value: string;
  delta: number;
  trend: "up" | "down" | "flat";
  hint?: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  agent: string;
  action: string;
  status: "success" | "warning" | "info" | "error";
}

export interface AIInsight {
  id: string;
  title: string;
  summary: string;
  impact: "High" | "Medium" | "Low";
  confidence: number;
  category: "Inventory" | "Demand" | "Logistics" | "Risk";
}

export interface AutonomousDecision {
  id: string;
  title: string;
  description: string;
  confidence: number;
  status: "executed" | "pending" | "review";
  timestamp: string;
}

export interface WarehouseUtil {
  id: string;
  name: string;
  region: string;
  utilization: number;
  capacity: number;
}
