const apiBaseUrl = (process.env.VITE_API_BASE_URL || "http://localhost:8000").replace(/\/+$/, "");
const watchMode = process.argv.includes("--watch");

async function request(path, options) {
  const response = await fetch(`${apiBaseUrl}${path}`, options);
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(`${path} failed with ${response.status}: ${JSON.stringify(body)}`);
  }

  return body;
}

async function smokeTest() {
  const health = await request("/");
  console.log(`[${new Date().toLocaleTimeString()}] Backend health: ${health.status || "unknown"}`);

  const query = await request("/query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "Give me a short supply chain status update.",
      use_rag: false,
    }),
  });

  if (!query.response) {
    throw new Error("/query did not return a response field");
  }

  console.log(
    `Query response: ${query.response.slice(0, 120)}${query.response.length > 120 ? "..." : ""}`,
  );
}

if (watchMode) {
  console.log(`Watching backend connection at ${apiBaseUrl}. Press Ctrl+C to stop.`);
  await smokeTest().catch((error) => console.error(error.message));
  setInterval(() => {
    smokeTest().catch((error) =>
      console.error(`[${new Date().toLocaleTimeString()}] ${error.message}`),
    );
  }, 10000);
} else {
  await smokeTest();
}
