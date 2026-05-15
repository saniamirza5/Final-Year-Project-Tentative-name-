import asyncio
import json
import random
from fastapi import APIRouter
from fastapi.responses import StreamingResponse

stream_router = APIRouter()

# --- Baselines ---

kpi_metrics = [
    {"id": "k1", "label": "On-Time Delivery", "value": "97.4%", "delta": 1.8, "trend": "up", "hint": "vs last 7d"},
    {"id": "k2", "label": "Forecast Accuracy", "value": "94.1%", "delta": 0.6, "trend": "up", "hint": "MAPE 5.9%"},
    {"id": "k3", "label": "Inventory Turns", "value": "8.2x", "delta": -0.3, "trend": "down", "hint": "rolling 30d"},
    {"id": "k4", "label": "Active Shipments", "value": "1,284", "delta": 4.2, "trend": "up", "hint": "12 at risk"},
    {"id": "k5", "label": "Cost per Order", "value": "$12.48", "delta": -2.1, "trend": "up", "hint": "AI optimized"},
    {"id": "k6", "label": "AI Decisions / hr", "value": "342", "delta": 11.5, "trend": "up", "hint": "autonomous"},
]

activity_feed = [
    {"id": "a1", "timestamp": "2m ago", "agent": "ForecastAgent", "action": "Re-trained demand model for Region EU-West (+2.1% accuracy)", "status": "success"},
    {"id": "a2", "timestamp": "6m ago", "agent": "RiskAgent", "action": "Flagged supplier ACME-2241 — lead time variance > 3σ", "status": "warning"},
    {"id": "a3", "timestamp": "11m ago", "agent": "InventoryAgent", "action": "Auto-generated PO #44120 for SKU-882 (Critical)", "status": "info"},
]

inventory_items = [
  {"sku": "SKU-882", "name": "Industrial Bearing 60mm", "category": "Components", "warehouse": "Dallas DC", "stock": 412, "reorderPoint": 800, "status": "Critical", "daysOfCover": 4},
  {"sku": "SKU-1042", "name": "Lithium Cell 18650", "category": "Electronics", "warehouse": "Newark DC", "stock": 6420, "reorderPoint": 5000, "status": "Low", "daysOfCover": 9},
  {"sku": "SKU-330", "name": "Hydraulic Hose Kit", "category": "Industrial", "warehouse": "LAX Hub", "stock": 12880, "reorderPoint": 6000, "status": "Healthy", "daysOfCover": 22},
  {"sku": "SKU-441", "name": "Carbon Brake Pad", "category": "Auto", "warehouse": "Rotterdam", "stock": 28200, "reorderPoint": 9000, "status": "Overstock", "daysOfCover": 58},
]

forecast_series = [
  {"period": "Week 1", "actual": 4200, "forecast": 4150, "upper": 4400, "lower": 3900},
  {"period": "Week 2", "actual": 4480, "forecast": 4400, "upper": 4680, "lower": 4120},
  {"period": "Week 3", "actual": 4620, "forecast": 4580, "upper": 4880, "lower": 4280},
  {"period": "Week 4", "actual": 4910, "forecast": 4880, "upper": 5200, "lower": 4560},
  {"period": "Week 5", "actual": 5180, "forecast": 5210, "upper": 5520, "lower": 4900},
  {"period": "Week 6", "actual": 5320, "forecast": 5390, "upper": 5700, "lower": 5080},
  {"period": "Week 7", "actual": None, "forecast": 5610, "upper": 5980, "lower": 5240},
  {"period": "Week 8", "actual": None, "forecast": 5820, "upper": 6240, "lower": 5400},
]

shipments = [
  {"id": "SH-44120", "origin": "Shenzhen", "destination": "LAX Hub", "carrier": "Maersk", "status": "On Time", "eta": "May 14, 09:20", "progress": 72, "riskScore": 12},
  {"id": "SH-44118", "origin": "Rotterdam", "destination": "Newark DC", "carrier": "MSC", "status": "Delayed", "eta": "May 16, 14:00", "progress": 48, "riskScore": 64},
  {"id": "SH-44117", "origin": "Dallas DC", "destination": "Chicago", "carrier": "FedEx", "status": "On Time", "eta": "May 13, 18:40", "progress": 91, "riskScore": 8},
]

risk_matrix = [
  {"category": "Supplier Default", "probability": 28, "impact": 82, "exposure": 64},
  {"category": "Port Congestion", "probability": 54, "impact": 58, "exposure": 71},
  {"category": "Demand Shock", "probability": 38, "impact": 74, "exposure": 60},
]


async def sse_format(data: dict):
    return f"data: {json.dumps(data)}\n\n"

# --- Generators ---

async def generate_dashboard():
    while True:
        # wiggle On-Time Delivery slightly
        val_0 = float(kpi_metrics[0]["value"].replace("%", ""))
        kpi_metrics[0]["value"] = f"{round(val_0 + random.uniform(-0.5, 0.5), 1)}%"
        
        val_3 = int(kpi_metrics[3]["value"].replace(",", ""))
        kpi_metrics[3]["value"] = f"{int(val_3 + random.randint(-10, 10)):,}"
        
        val_4 = float(kpi_metrics[4]["value"].replace("$", ""))
        kpi_metrics[4]["value"] = f"${round(val_4 + random.uniform(-0.2, 0.2), 2)}"
        
        payload = {
            "kpiMetrics": kpi_metrics,
            "activityFeed": activity_feed
        }
        yield await sse_format(payload)
        await asyncio.sleep(3)

async def generate_inventory():
    while True:
        # Randomly change stocks a bit
        for item in inventory_items:
            item["stock"] = max(0, item["stock"] + random.randint(-5, 5))
            if item["stock"] < item["reorderPoint"] * 0.8:
                item["status"] = "Critical"
            elif item["stock"] < item["reorderPoint"]:
                item["status"] = "Low"
            elif item["stock"] > item["reorderPoint"] * 2:
                item["status"] = "Overstock"
            else:
                item["status"] = "Healthy"
        
        yield await sse_format(inventory_items)
        await asyncio.sleep(4)

async def generate_forecasting():
    while True:
        for s in forecast_series:
            s["forecast"] += random.randint(-50, 50)
            
            # Recalculate upper and lower bounds dynamically around new forecast
            s["upper"] = s["forecast"] + random.randint(200, 300)
            s["lower"] = s["forecast"] - random.randint(200, 300)
            
            if s["actual"] is not None:
                s["actual"] += random.randint(-10, 10)
                
        yield await sse_format({"forecastSeries": forecast_series})
        await asyncio.sleep(5)

async def generate_shipments():
    while True:
        for s in shipments:
            if s["progress"] < 100:
                s["progress"] = min(100, s["progress"] + random.randint(0, 2))
            if s["progress"] == 100:
                s["status"] = "Delivered"
        yield await sse_format(shipments)
        await asyncio.sleep(3)

async def generate_risk():
    while True:
        for r in risk_matrix:
            r["probability"] = max(0, min(100, r["probability"] + random.randint(-2, 2)))
        yield await sse_format({"riskMatrix": risk_matrix})
        await asyncio.sleep(4)

# --- Routes ---

@stream_router.get("/dashboard")
async def stream_dashboard():
    return StreamingResponse(generate_dashboard(), media_type="text/event-stream")

@stream_router.get("/inventory")
async def stream_inventory():
    return StreamingResponse(generate_inventory(), media_type="text/event-stream")

@stream_router.get("/forecasting")
async def stream_forecasting():
    return StreamingResponse(generate_forecasting(), media_type="text/event-stream")

@stream_router.get("/shipments")
async def stream_shipments():
    return StreamingResponse(generate_shipments(), media_type="text/event-stream")

@stream_router.get("/risk")
async def stream_risk():
    return StreamingResponse(generate_risk(), media_type="text/event-stream")
