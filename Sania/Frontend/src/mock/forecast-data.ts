import type { ForecastPoint } from "@/types/prediction";

export const forecastSeries: ForecastPoint[] = [
  { period: "Wk 1", actual: 4200, forecast: 4150, upper: 4400, lower: 3900 },
  { period: "Wk 2", actual: 4480, forecast: 4400, upper: 4680, lower: 4120 },
  { period: "Wk 3", actual: 4620, forecast: 4580, upper: 4880, lower: 4280 },
  { period: "Wk 4", actual: 4910, forecast: 4880, upper: 5200, lower: 4560 },
  { period: "Wk 5", actual: 5180, forecast: 5210, upper: 5520, lower: 4900 },
  { period: "Wk 6", actual: 5320, forecast: 5390, upper: 5700, lower: 5080 },
  { period: "Wk 7", actual: null, forecast: 5610, upper: 5980, lower: 5240 },
  { period: "Wk 8", actual: null, forecast: 5820, upper: 6240, lower: 5400 },
  { period: "Wk 9", actual: null, forecast: 6020, upper: 6500, lower: 5540 },
  { period: "Wk 10", actual: null, forecast: 6240, upper: 6780, lower: 5700 },
];

export const inventoryHistory = [
  { month: "Nov", healthy: 62, low: 18, critical: 6, overstock: 14 },
  { month: "Dec", healthy: 64, low: 17, critical: 5, overstock: 14 },
  { month: "Jan", healthy: 66, low: 16, critical: 4, overstock: 14 },
  { month: "Feb", healthy: 65, low: 18, critical: 5, overstock: 12 },
  { month: "Mar", healthy: 68, low: 15, critical: 4, overstock: 13 },
  { month: "Apr", healthy: 70, low: 14, critical: 3, overstock: 13 },
  { month: "May", healthy: 71, low: 14, critical: 3, overstock: 12 },
];

export const shipmentVolume = [
  { day: "Mon", onTime: 412, delayed: 18, atRisk: 9 },
  { day: "Tue", onTime: 438, delayed: 22, atRisk: 7 },
  { day: "Wed", onTime: 460, delayed: 14, atRisk: 12 },
  { day: "Thu", onTime: 482, delayed: 19, atRisk: 8 },
  { day: "Fri", onTime: 510, delayed: 24, atRisk: 11 },
  { day: "Sat", onTime: 388, delayed: 12, atRisk: 5 },
  { day: "Sun", onTime: 296, delayed: 9, atRisk: 4 },
];
