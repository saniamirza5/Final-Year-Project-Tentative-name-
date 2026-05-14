import { riskMatrix, riskTrend } from "@/mock/risk-data";

export async function getRiskMatrix() { return Promise.resolve(riskMatrix); }
export async function getRiskTrend() { return Promise.resolve(riskTrend); }
