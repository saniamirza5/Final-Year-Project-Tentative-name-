## Plan: Continuous Mock Data Streaming

The backend will expose real-time endpoints (Server-Sent Events or WebSockets) to continuously push dynamic mock data for tables and charts across the dashboard, inventory, forecasting, risk, and shipment pages, replacing the static frontend mock files.

**Steps**

1. Create `Backend/sendData.py` to define a FastAPI router containing data generators for each domain (Dashboard, Inventory, Forecasting, Shipments, Risk).
2. Implement background tasks or asynchronous event generators in `sendData.py` that yield dynamic, slightly changing mock data every few seconds (using `asyncio.sleep` to simulate continuous updates).
3. Update `Backend/main.py` to import and `include_router` from `sendData.py`.
4. Create a unified custom hook in the Frontend (e.g., `useContinuousData.ts` or modify existing services) to subscribe to the backend streams via `EventSource` (SSE) or WebSockets.
5. Update `Frontend/src/services/*.ts` to remove static mock references and wire the components to the new continuous streaming hook.

**Relevant files**

- `Final_App/Backend/sendData.py` (New) — Will contain the data generation logic and streaming endpoints.
- `Final_App/Backend/main.py` — Will mount the new streaming router.
- `Final_App/Frontend/src/services/*.ts` (e.g., `forecasting.ts`, `inventory.ts`, `risk.ts`, `shipments.ts`) — Will be modified to receive real-time data instead of resolving static arrays.
- `Final_App/Frontend/src/mock/*.ts` — Can be deprecated or used strictly as seed shapes for the backend.

**Verification**

1. Start the FastAPI backend and verify the streaming endpoints (e.g., `curl -N http://localhost:8000/api/stream/inventory`) continuously output JSON diffs.
2. Start the Vite React frontend and verify that tables and charts visually update (pulse/tick) every few seconds without page reloads.

**Decisions**

- Server-Sent Events (SSE) via FastAPI's `StreamingResponse` is recommended over WebSockets because it is simpler for one-way (server-to-client) continuous data delivery, which perfectly matches "send mock data continuously to frontend".
- Data variations will be simulated by adding slight random noise or shifting timestamps to the static baseline.

**Further Considerations**

1. Should we use WebSockets instead of Server-Sent Events (SSE)? SSE is native HTTP, simpler to implement for one-way streams, and easily reconnects. WebSockets are better if the frontend needs to frequently send _back_ rapid commands. Recommendation: Go with SSE.
2. Do you want the mock data simulation to completely replace the existing frontend mock files, or should the frontend fallback to the static files if the backend connection drops?
