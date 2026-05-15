export interface InventoryItem {
  sku: string;
  name: string;
  category: string;
  warehouse: string;
  stock: number;
  reorderPoint: number;
  status: "Healthy" | "Low" | "Critical" | "Overstock";
  daysOfCover: number;
}
