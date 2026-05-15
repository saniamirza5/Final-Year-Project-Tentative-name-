/**
 * Optional Node.js mock backend — use when the Python backend is not available.
 * Now includes mock RAG data so supply-chain queries return realistic responses.
 * Start with: npm run mock:backend
 */
import http from "node:http";

const host = process.env.MOCK_BACKEND_HOST || "127.0.0.1";
const port = Number(process.env.MOCK_BACKEND_PORT || 8000);

// ---------------------------------------------------------------------------
// Mock RAG knowledge base — mirrors Backend/mock_data.py
// ---------------------------------------------------------------------------
const RAG_DOCS = [
  {
    keywords: ["shipment", "delivery", "late", "carrier", "lane", "transit"],
    source: "shipments/weekly-report-2026-W20.md",
    response:
      "Based on the latest shipment data: 1,247 shipments dispatched across 14 lanes " +
      "with a 93.1% on-time delivery rate (target 95%). 4 shipments arrived late on " +
      "Lane LAX→DFW (avg delay 18h). Carrier ACME Logistics accounted for 3 of 6 late " +
      "deliveries. Action: escalate SLA review with ACME Logistics by Friday.",
    confidence: 0.91,
  },
  {
    keywords: ["forecast", "demand", "prediction", "sku-330", "promo", "mape"],
    source: "forecasting/demand-forecast-na-central.md",
    response:
      "Demand Forecast for NA-Central (next 14 days): SKU-330 family projected +12.4% " +
      "driven by seasonal promo. SKU-441 EU-West stable with small downward drift (-3%). " +
      "Model confidence: 91% (XGBoost + LSTM ensemble). Recommend pre-positioning " +
      "2 truckloads to Dallas DC by Thursday. Historical MAPE: 6.8%.",
    confidence: 0.91,
  },
  {
    keywords: ["inventory", "stock", "sku", "reorder", "warehouse", "critical"],
    source: "inventory/health-summary-2026-05.md",
    response:
      "Inventory Health: 3,412 SKUs tracked. 2 SKUs in CRITICAL state — " +
      "SKU-118 (Dallas DC, 3 days cover) and SKU-902 (Chicago DC, 2 days cover). " +
      "Auto-replenishment POs triggered. 12 SKUs overstocked in EU — $214K " +
      "working-capital opportunity. Average days-of-cover: 21 days.",
    confidence: 0.88,
  },
  {
    keywords: ["risk", "supplier", "acme", "disruption", "port", "tariff"],
    source: "risk/supplier-risk-assessment.md",
    response:
      "Supplier Risk Assessment: HIGH RISK — Supplier ACME-2241 (lead-time variance >3σ, " +
      "quality reject rate 4.1%, financial health score C). MEDIUM RISK — Supplier " +
      "GammaTech (single-source dependency for SKU-770, Taiwan fab exposure). " +
      "Port congestion at Long Beach +18% WoW. US-EU tariff revision effective June 1 (+8%).",
    confidence: 0.86,
  },
];

function matchRagDoc(query) {
  const lower = query.toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const doc of RAG_DOCS) {
    const score = doc.keywords.filter((kw) => lower.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      best = doc;
    }
  }
  return best;
}

const MOCK_TRIGGER_WORDS = ["mock", "connection", "test", "backend"];
function isMockConnectionQuery(query) {
  const lower = query.toLowerCase();
  return MOCK_TRIGGER_WORDS.some((w) => lower.includes(w));
}

// ---------------------------------------------------------------------------
// HTTP server
// ---------------------------------------------------------------------------
function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Origin":
      response.req.headers.origin || "http://127.0.0.1:8082",
    "Content-Type": "application/json",
  });
  response.end(JSON.stringify(payload));
}

const server = http.createServer((request, response) => {
  if (request.method === "OPTIONS") {
    sendJson(response, 204, {});
    return;
  }

  if (request.method === "GET" && request.url === "/") {
    sendJson(response, 200, {
      message: "Mock AI RAG API is running",
      status: "healthy",
      version: "mock",
      documents_loaded: RAG_DOCS.length,
      mock_trigger:
        "POST /query from the frontend chatbot",
    });
    return;
  }

  if (request.method === "POST" && request.url === "/query") {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => {
      const parsed = body ? JSON.parse(body) : {};
      const query = parsed.query || "no query";

      // Mock-connection short-circuit
      if (isMockConnectionQuery(query)) {
        sendJson(response, 200, {
          response:
            "MOCK_BACKEND_CONNECTION_OK: Node mock backend received your frontend request. " +
            `Echoed query: '${query}'. Dashboard sample: 4 late shipments, ` +
            "91% forecast confidence, 2 critical inventory alerts.",
          sources: [
            "mock://backend/connection-check",
            "mock://shipments/late-count=4",
            "mock://inventory/critical-alerts=2",
          ],
          confidence: 0.99,
        });
        return;
      }

      // RAG-style response
      const match = matchRagDoc(query);
      if (match) {
        sendJson(response, 200, {
          response: match.response,
          sources: [match.source],
          confidence: match.confidence,
        });
      } else {
        sendJson(response, 200, {
          response:
            `I processed your query: "${query}". I don't have specific data matching ` +
            "this topic in my knowledge base yet. Try asking about shipments, forecasting, " +
            "inventory, or supplier risk.",
          sources: [],
          confidence: 0.5,
        });
      }
    });
    return;
  }

  sendJson(response, 404, { detail: "Not found" });
});

server.listen(port, host, () => {
  console.log(`Mock backend listening at http://${host}:${port}`);
  console.log(`Loaded ${RAG_DOCS.length} mock RAG documents.`);
  console.log("Open the frontend and ask about shipments, forecasts, inventory, or risk.");
});
