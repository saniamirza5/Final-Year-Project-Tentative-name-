# ---------------------------------------------------------------------------
# start.ps1 — Start both Backend and Frontend for Final_app (Windows)
#
# Usage:
#   cd Final_app
#   powershell -ExecutionPolicy Bypass -File start.ps1
#
# Stops both services on Ctrl+C.
# ---------------------------------------------------------------------------

$ErrorActionPreference = "Stop"

$ScriptDir   = Split-Path -Parent $MyInvocation.MyCommand.Path
$BackendDir  = Join-Path $ScriptDir "Backend"
$FrontendDir = Join-Path $ScriptDir "Frontend"

# ── Backend ────────────────────────────────────────────────────────────────
Write-Host "[start.ps1] Starting Backend (FastAPI) on http://127.0.0.1:8000 ..." -ForegroundColor Cyan
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:BackendDir
    python main.py
}

# Give the backend a moment to bind the port
Start-Sleep -Seconds 4

# ── Frontend ───────────────────────────────────────────────────────────────
Write-Host "[start.ps1] Starting Frontend (Vite) on http://127.0.0.1:8082 ..." -ForegroundColor Cyan
$frontendJob = Start-Job -ScriptBlock {
    Set-Location $using:FrontendDir
    npm run dev -- --host 127.0.0.1 --port 8082
}

Write-Host ""
Write-Host "=============================================" -ForegroundColor Green
Write-Host "  Backend  -> http://127.0.0.1:8000"          -ForegroundColor Green
Write-Host "  Frontend -> http://127.0.0.1:8082"          -ForegroundColor Green
Write-Host "  Press Ctrl+C to stop both services."        -ForegroundColor Yellow
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""

# Stream output from both jobs until user presses Ctrl+C
try {
    while ($true) {
        # Print any new output from backend
        Receive-Job -Job $backendJob -ErrorAction SilentlyContinue | ForEach-Object {
            Write-Host "[Backend]  $_" -ForegroundColor DarkYellow
        }
        # Print any new output from frontend
        Receive-Job -Job $frontendJob -ErrorAction SilentlyContinue | ForEach-Object {
            Write-Host "[Frontend] $_" -ForegroundColor DarkCyan
        }
        Start-Sleep -Milliseconds 500
    }
}
finally {
    Write-Host "`n[start.ps1] Shutting down..." -ForegroundColor Red
    Stop-Job -Job $backendJob  -ErrorAction SilentlyContinue
    Stop-Job -Job $frontendJob -ErrorAction SilentlyContinue
    Remove-Job -Job $backendJob, $frontendJob -Force -ErrorAction SilentlyContinue
    Write-Host "[start.ps1] Done." -ForegroundColor Red
}
