import { shipments } from "@/mock/shipment-data";
import type { ShipmentRecord } from "@/types/prediction";

export async function getShipments(): Promise<ShipmentRecord[]> {
  return Promise.resolve(shipments);
}
