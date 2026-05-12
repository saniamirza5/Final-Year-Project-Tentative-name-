import type { ShipmentRecord } from "@/types/prediction";

export const shipments: ShipmentRecord[] = [
  { id: "SH-44120", origin: "Shenzhen", destination: "LAX Hub", carrier: "Maersk", status: "On Time", eta: "May 14, 09:20", progress: 72, riskScore: 12 },
  { id: "SH-44118", origin: "Rotterdam", destination: "Newark DC", carrier: "MSC", status: "Delayed", eta: "May 16, 14:00", progress: 48, riskScore: 64 },
  { id: "SH-44117", origin: "Dallas DC", destination: "Chicago", carrier: "FedEx", status: "On Time", eta: "May 13, 18:40", progress: 91, riskScore: 8 },
  { id: "SH-44115", origin: "Singapore", destination: "Sydney", carrier: "DHL", status: "At Risk", eta: "May 15, 22:10", progress: 33, riskScore: 78 },
  { id: "SH-44113", origin: "LAX Hub", destination: "Phoenix", carrier: "UPS", status: "Delivered", eta: "May 12, 11:00", progress: 100, riskScore: 4 },
  { id: "SH-44109", origin: "Hamburg", destination: "Warsaw", carrier: "DB Schenker", status: "On Time", eta: "May 14, 06:50", progress: 64, riskScore: 18 },
];
