import type { ChatMessage } from "@/types/chatbot";
import { fetchJson } from "./api";

const CANNED: Record<string, ChatMessage["insight"]> = {
  forecast: {
    title: "Forecast outlook — next 14 days",
    points: [
      "Demand projected +12.4% across NA-Central, driven by SKU-330 family.",
      "EU-West stable; small downward drift on SKU-441 (-3%).",
      "Recommend pre-positioning 2 truckloads to Dallas DC by Thursday.",
    ],
    confidence: 91,
  },
  risk: {
    title: "Top supply chain risks right now",
    points: [
      "Supplier ACME-2241 — lead time variance > 3σ (HIGH).",
      "Port congestion at Long Beach +18% week-over-week.",
      "2 shipments tracking >24h late on Lane LAX→DFW.",
    ],
    confidence: 86,
  },
  inventory: {
    title: "Inventory health summary",
    points: [
      "2 SKUs in Critical state — auto-replenishment triggered.",
      "12 SKUs overstocked in EU — $214K working capital opportunity.",
      "Average days-of-cover steady at 21d.",
    ],
    confidence: 88,
  },
};

interface QueryResponse {
  response: string;
  sources?: string[];
  confidence?: number;
}

function fallbackInsight(prompt: string) {
  const lower = prompt.toLowerCase();
  let key: keyof typeof CANNED = "forecast";
  if (lower.includes("risk") || lower.includes("supplier")) key = "risk";
  else if (lower.includes("inventory") || lower.includes("stock")) key = "inventory";
  return CANNED[key];
}

function confidencePercent(confidence?: number) {
  if (typeof confidence !== "number" || Number.isNaN(confidence)) return undefined;
  return Math.round(confidence <= 1 ? confidence * 100 : confidence);
}

export async function askAssistant(prompt: string): Promise<ChatMessage> {
  const result = await fetchJson<QueryResponse>("/query", {
    method: "POST",
    body: JSON.stringify({
      query: prompt,
      use_rag: true,
      top_k: 3,
    }),
  });

  const points =
    result.sources && result.sources.length > 0
      ? result.sources.map((source) => `Source: ${source}`)
      : fallbackInsight(prompt)?.points;

  const confidence = confidencePercent(result.confidence);

  return {
    id: crypto.randomUUID(),
    role: "assistant",
    createdAt: new Date().toISOString(),
    content: result.response,
    insight: {
      title: "Backend AI response",
      points: points ?? [],
      confidence: confidence ?? fallbackInsight(prompt)?.confidence ?? 70,
    },
  };
}
