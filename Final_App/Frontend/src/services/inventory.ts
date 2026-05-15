import { inventoryItems } from "@/mock/inventory-data";
import type { InventoryItem } from "@/types/inventory";

export async function getInventory(): Promise<InventoryItem[]> {
  return Promise.resolve(inventoryItems);
}
