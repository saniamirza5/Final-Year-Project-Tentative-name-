import { forecastSeries } from "@/mock/forecast-data";
import type { ForecastPoint } from "@/types/prediction";

export async function getForecast(): Promise<ForecastPoint[]> {
  return Promise.resolve(forecastSeries);
}
