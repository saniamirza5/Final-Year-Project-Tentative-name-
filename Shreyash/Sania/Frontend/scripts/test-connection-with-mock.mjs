import { spawn } from "node:child_process";
import http from "node:http";

const server = http.createServer((request, response) => {
  response.setHeader("Content-Type", "application/json");

  if (request.method === "GET" && request.url === "/") {
    response.end(
      JSON.stringify({
        message: "Mock AI RAG API is running",
        status: "healthy",
        version: "test",
      }),
    );
    return;
  }

  if (request.method === "POST" && request.url === "/query") {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => {
      const parsed = body ? JSON.parse(body) : {};
      response.end(
        JSON.stringify({
          response: `Mock backend received: ${parsed.query || "no query"}`,
          sources: ["mock-backend"],
          confidence: 0.99,
        }),
      );
    });
    return;
  }

  response.statusCode = 404;
  response.end(JSON.stringify({ detail: "Not found" }));
});

await new Promise((resolve) => {
  server.listen(0, "127.0.0.1", resolve);
});

const { port } = server.address();
const apiBaseUrl = `http://127.0.0.1:${port}`;

const child = spawn(process.execPath, ["scripts/test-backend-connection.mjs"], {
  cwd: new URL("..", import.meta.url),
  env: {
    ...process.env,
    VITE_API_BASE_URL: apiBaseUrl,
  },
  stdio: "inherit",
});

const exitCode = await new Promise((resolve) => {
  child.on("exit", resolve);
});

await new Promise((resolve) => server.close(resolve));

if (exitCode !== 0) {
  process.exit(exitCode);
}
