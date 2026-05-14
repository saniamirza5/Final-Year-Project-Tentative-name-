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

function mockQueryPayload(query) {
  return {
    response:
      "MOCK_BACKEND_CONNECTION_OK: Node mock backend received your frontend request. " +
      `Echoed query: '${query || "no query"}'. Dashboard sample: 4 late shipments, ` +
      "91% forecast confidence, 2 critical inventory alerts.",
    sources: [
      "mock://backend/connection-check",
      "mock://shipments/late-count=4",
      "mock://inventory/critical-alerts=2",
    ],
    confidence: 0.99,
  };
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
      sendJson(response, 200, mockQueryPayload(parsed.query));
    });
    return;
  }

  sendJson(response, 404, { detail: "Not found" });
});

server.listen(port, host, () => {
  console.log(`Mock backend listening at http://${host}:${port}`);
  console.log("Open the frontend and ask: mock backend connection test");
});
