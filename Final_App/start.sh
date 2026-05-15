#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# start.sh — Start both Backend and Frontend for Final_app
#
# Usage:
#   cd Final_app
#   bash start.sh
#
# Stops both services on Ctrl+C.
# ---------------------------------------------------------------------------

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/Backend"
FRONTEND_DIR="$SCRIPT_DIR/Frontend"

# Track child PIDs so we can clean up on exit
BACKEND_PID=""
FRONTEND_PID=""

cleanup() {
  echo ""
  echo "[start.sh] Shutting down..."
  [ -n "$BACKEND_PID" ]  && kill "$BACKEND_PID"  2>/dev/null
  [ -n "$FRONTEND_PID" ] && kill "$FRONTEND_PID" 2>/dev/null
  wait 2>/dev/null
  echo "[start.sh] Done."
}
trap cleanup EXIT INT TERM

# ── Backend ────────────────────────────────────────────────────────────────
echo "[start.sh] Starting Backend (FastAPI) on http://127.0.0.1:8000 ..."
(
  cd "$BACKEND_DIR"
  python main.py
) &
BACKEND_PID=$!

# Give the backend a moment to bind the port
sleep 3

# ── Frontend ───────────────────────────────────────────────────────────────
echo "[start.sh] Starting Frontend (Vite) on http://127.0.0.1:8082 ..."
(
  cd "$FRONTEND_DIR"
  npm run dev -- --host 127.0.0.1 --port 8082
) &
FRONTEND_PID=$!

echo ""
echo "============================================="
echo "  Backend  → http://127.0.0.1:8000"
echo "  Frontend → http://127.0.0.1:8082"
echo "  Press Ctrl+C to stop both services."
echo "============================================="
echo ""

# Wait for either process to exit
wait
