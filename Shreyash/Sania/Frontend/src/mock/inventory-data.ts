import type { InventoryItem } from "@/types/inventory";

export const inventoryItems: InventoryItem[] = [
  { sku: "SKU-882", name: "Industrial Bearing 60mm", category: "Components", warehouse: "Dallas DC", stock: 412, reorderPoint: 800, status: "Critical", daysOfCover: 4 },
  { sku: "SKU-1042", name: "Lithium Cell 18650", category: "Electronics", warehouse: "Newark DC", stock: 6420, reorderPoint: 5000, status: "Low", daysOfCover: 9 },
  { sku: "SKU-330", name: "Hydraulic Hose Kit", category: "Industrial", warehouse: "LAX Hub", stock: 12880, reorderPoint: 6000, status: "Healthy", daysOfCover: 22 },
  { sku: "SKU-441", name: "Carbon Brake Pad", category: "Auto", warehouse: "Rotterdam", stock: 28200, reorderPoint: 9000, status: "Overstock", daysOfCover: 58 },
  { sku: "SKU-720", name: "Sensor Module v3", category: "Electronics", warehouse: "Singapore", stock: 4910, reorderPoint: 4500, status: "Low", daysOfCover: 11 },
  { sku: "SKU-118", name: "Aluminum Frame Set", category: "Industrial", warehouse: "Dallas DC", stock: 17400, reorderPoint: 8000, status: "Healthy", daysOfCover: 27 },
  { sku: "SKU-907", name: "Polymer Resin Drum", category: "Materials", warehouse: "LAX Hub", stock: 980, reorderPoint: 1500, status: "Critical", daysOfCover: 5 },
  { sku: "SKU-512", name: "Connector Pack 24p", category: "Components", warehouse: "Newark DC", stock: 21200, reorderPoint: 10000, status: "Healthy", daysOfCover: 31 },
];
