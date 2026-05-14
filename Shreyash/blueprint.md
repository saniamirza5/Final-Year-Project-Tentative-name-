# Frontend and Backend Connection Blueprint

Use this blueprint when connecting a similar project with this folder layout:

```text
ProjectRoot/
  Utkarsh/Backend/
    main.py
  Sania/Frontend/
    package.json
    src/services/api.ts
    src/services/chatbot.ts
```

In the current project, the backend folder is `Utkarsh/`. If your similar project uses `Utkarsh/Backend/`, apply the same backend changes inside `Utkarsh/Backend/main.py`.

## Connection Goal

The frontend runs at:

```text
http://127.0.0.1:8082/
```

The backend runs at:

```text
http://127.0.0.1:8000/
```

The frontend chatbot sends requests to:

```text
POST http://127.0.0.1:8000/query
```

The backend returns mock data when the user prompt contains any of these words:

```text
mock
connection
test
backend
```

Example frontend prompt:

```text
mock backend connection test
```

Expected visible response:

```text
MOCK_BACKEND_CONNECTION_OK: FastAPI received your frontend request...
```

## Backend Setup

In `Utkarsh/Backend/main.py`, make sure FastAPI allows the frontend origin.

```python
frontend_origins = [
    origin.strip()
    for origin in os.getenv(
        "FRONTEND_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173,http://localhost:8082,http://127.0.0.1:8082",
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Add a deterministic mock response helper:

```python
def is_mock_connection_query(query: str) -> bool:
    lowered = query.lower()
    trigger_words = ("mock", "connection", "test", "backend")
    return any(word in lowered for word in trigger_words)

def build_mock_connection_response(query: str) -> QueryResponse:
    return QueryResponse(
        response=(
            "MOCK_BACKEND_CONNECTION_OK: FastAPI received your frontend request. "
            f"Echoed query: '{query}'. Dashboard sample: 4 late shipments, "
            "91% forecast confidence, 2 critical inventory alerts."
        ),
        sources=[
            "mock://backend/connection-check",
            "mock://shipments/late-count=4",
            "mock://inventory/critical-alerts=2",
        ],
        confidence=0.99,
    )
```

Then place this at the top of the `/query` route logic:

```python
@app.post("/query", response_model=QueryResponse, tags=["AI Queries"])
async def query(request: QueryRequest):
    try:
        if is_mock_connection_query(request.query):
            return build_mock_connection_response(request.query)

        # existing RAG or AI logic continues here
```

Also update the health route so it explains how to trigger the mock:

```python
@app.get("/", tags=["Health"])
async def root():
    return {
        "message": "AI RAG API is running",
        "status": "healthy",
        "version": "1.0.0",
        "mock_trigger": "POST /query with a prompt containing mock, connection, test, or backend",
    }
```

## Frontend API Setup

In `Sania/Frontend/src/services/api.ts`, keep the backend base URL as:

```ts
const DEFAULT_API_BASE_URL = "http://localhost:8000";

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(
  /\/+$/,
  "",
);
```

The frontend can also be pointed to another backend without code changes:

```powershell
$env:VITE_API_BASE_URL="http://127.0.0.1:8000"
npm run dev -- --host 127.0.0.1 --port 8082
```

## Chatbot Request Contract

In `Sania/Frontend/src/services/chatbot.ts`, the chatbot should call:

```ts
const result = await fetchJson<QueryResponse>("/query", {
  method: "POST",
  body: JSON.stringify({
    query: prompt,
    use_rag: true,
    top_k: 3,
  }),
});
```

The backend response shape must match:

```ts
interface QueryResponse {
  response: string;
  sources?: string[];
  confidence?: number;
}
```

## Optional Node Mock Backend

This is useful if Python is not installed correctly or the real backend is not ready yet.

Create `Sania/Frontend/scripts/mock-backend.mjs`:

```js
import http from "node:http";

const host = process.env.MOCK_BACKEND_HOST || "127.0.0.1";
const port = Number(process.env.MOCK_BACKEND_PORT || 8000);

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Origin": response.req.headers.origin || "http://127.0.0.1:8082",
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
      mock_trigger: "POST /query from the frontend chatbot",
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
      sendJson(response, 200, {
        response:
          "MOCK_BACKEND_CONNECTION_OK: Node mock backend received your frontend request. " +
          `Echoed query: '${parsed.query || "no query"}'. Dashboard sample: 4 late shipments, ` +
          "91% forecast confidence, 2 critical inventory alerts.",
        sources: [
          "mock://backend/connection-check",
          "mock://shipments/late-count=4",
          "mock://inventory/critical-alerts=2",
        ],
        confidence: 0.99,
      });
    });
    return;
  }

  sendJson(response, 404, { detail: "Not found" });
});

server.listen(port, host, () => {
  console.log(`Mock backend listening at http://${host}:${port}`);
  console.log("Open the frontend and ask: mock backend connection test");
});
```

Add this script to `Sania/Frontend/package.json`:

```json
{
  "scripts": {
    "mock:backend": "node scripts/mock-backend.mjs"
  }
}
```

## Run Commands

Start the backend:

```powershell
cd Utkarsh/Backend
python main.py
```

Or start the optional Node mock backend:

```powershell
cd Sania/Frontend
npm run mock:backend
```

Start the frontend on the same URL used in testing:

```powershell
cd Sania/Frontend
npm run dev -- --host 127.0.0.1 --port 8082
```

Open:

```text
http://127.0.0.1:8082/
```

Go to the AI Assistant or chatbot and send:

```text
mock backend connection test
```

## Manual Verification

Health check:

```powershell
Invoke-RestMethod -Uri http://127.0.0.1:8000/
```

Query check:

```powershell
Invoke-RestMethod `
  -Uri http://127.0.0.1:8000/query `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"query":"mock backend connection test","use_rag":false}'
```

Expected response fields:

```json
{
  "response": "MOCK_BACKEND_CONNECTION_OK: ...",
  "sources": ["mock://backend/connection-check"],
  "confidence": 0.99
}
```

## Troubleshooting

If the browser shows a CORS error, confirm that `http://127.0.0.1:8082` is included in `FRONTEND_ORIGINS` or in the hardcoded default origins.

If the frontend cannot reach the backend, confirm the backend is listening on port `8000`:

```powershell
Get-NetTCPConnection -LocalPort 8000 -State Listen
```

If the frontend uses a different backend URL, set:

```powershell
$env:VITE_API_BASE_URL="http://127.0.0.1:8000"
```

If Python does not run, use the Node mock backend until Python is installed or repaired.
