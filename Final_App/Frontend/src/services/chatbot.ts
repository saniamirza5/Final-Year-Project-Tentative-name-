import type { ChatMessage } from "@/types/chatbot";
import { fetchJson } from "@/services/api";

// ---------------------------------------------------------------------------
// Backend response shape (matches FastAPI QueryResponse model)
// ---------------------------------------------------------------------------
interface QueryResponse {
  response: string;
  sources?: string[];
  confidence?: number;
}

// ---------------------------------------------------------------------------
// Offline / fallback canned responses
// ---------------------------------------------------------------------------
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

function pickFallbackInsight(prompt: string): ChatMessage["insight"] {
  const lower = prompt.toLowerCase();
  if (lower.includes("risk") || lower.includes("supplier")) return CANNED.risk;
  if (lower.includes("inventory") || lower.includes("stock"))
    return CANNED.inventory;
  return CANNED.forecast;
}

// ---------------------------------------------------------------------------
// Public API — signature unchanged so the store needs zero changes
// ---------------------------------------------------------------------------
export async function askAssistant(prompt: string): Promise<ChatMessage> {
  try {
    const result = await fetchJson<QueryResponse>("/query", {
      method: "POST",
      body: JSON.stringify({
        query: prompt,
        use_rag: true,
        top_k: 3,
      }),
    });

    return {
      id: crypto.randomUUID(),
      role: "assistant",
      createdAt: new Date().toISOString(),
      content: result.response,
      insight: result.confidence
        ? {
            title: "Backend response",
            points: result.sources ?? [],
            confidence: Math.round(result.confidence * 100),
          }
        : undefined,
    };
  } catch {
    // Fallback to canned data when the backend is unreachable
    await new Promise((r) => setTimeout(r, 700));

    return {
      id: crypto.randomUUID(),
      role: "assistant",
      createdAt: new Date().toISOString(),
      content: `Here's what I'm seeing across the network based on your query: "${prompt}".`,
      insight: pickFallbackInsight(prompt),
    };
  }
}
