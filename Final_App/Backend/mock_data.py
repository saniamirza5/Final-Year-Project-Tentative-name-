"""
Mock supply-chain documents for RAG seeding.

On first startup the backend loads these into ChromaDB so that the chatbot
can retrieve relevant context even before any real documents are uploaded.
The data is persisted in ./chroma_db — subsequent restarts skip re-seeding
unless the collection is empty.
"""

from typing import List, Dict

MOCK_DOCUMENTS: List[Dict[str, str]] = [
    # ── Shipments ──────────────────────────────────────────────────────
    {
        "source": "shipments/weekly-report-2026-W20.md",
        "content": (
            "Weekly Shipment Report — Week 20, 2026\n\n"
            "Total shipments dispatched: 1,247 across 14 lanes.\n"
            "On-time delivery rate: 93.1% (target 95%).\n"
            "4 shipments arrived late on Lane LAX→DFW (avg delay 18h).\n"
            "2 shipments delayed on Lane JFK→ORD due to weather holds.\n"
            "Carrier ACME Logistics accounted for 3 of 6 late deliveries.\n"
            "Action: escalate SLA review with ACME Logistics by Friday."
        ),
    },
    {
        "source": "shipments/carrier-performance-q1.md",
        "content": (
            "Carrier Performance Summary — Q1 2026\n\n"
            "Top carrier: FastFreight Inc — 97.2% on-time, 0 damage claims.\n"
            "Lowest performer: ACME Logistics — 88.4% on-time, 5 damage claims.\n"
            "Average transit time NA-Central: 2.3 days (down from 2.7 in Q4 2025).\n"
            "Cost-per-shipment decreased 4% YoY due to lane consolidation.\n"
            "Recommendation: shift 15% volume from ACME to FastFreight on LAX lanes."
        ),
    },
    # ── Forecasting ────────────────────────────────────────────────────
    {
        "source": "forecasting/demand-forecast-na-central.md",
        "content": (
            "Demand Forecast — NA-Central Region — Next 14 Days\n\n"
            "SKU-330 family projected +12.4% driven by seasonal promo.\n"
            "SKU-441 EU-West stable with small downward drift (-3%).\n"
            "Model confidence: 91% (ensemble of XGBoost + LSTM).\n"
            "Recommend pre-positioning 2 truckloads to Dallas DC by Thursday.\n"
            "Historical MAPE for this period: 6.8%."
        ),
    },
    {
        "source": "forecasting/accuracy-review-q1.md",
        "content": (
            "Forecast Accuracy Review — Q1 2026\n\n"
            "Overall MAPE: 7.2% (target <8%).\n"
            "Best region: NA-Central at 5.9% MAPE.\n"
            "Worst region: APAC at 11.3% MAPE — driven by CNY demand spike.\n"
            "Model retrained on 2025 holiday data — APAC error expected to drop.\n"
            "Bias analysis: slight over-forecast on EU-West low-volume SKUs."
        ),
    },
    # ── Inventory ──────────────────────────────────────────────────────
    {
        "source": "inventory/health-summary-2026-05.md",
        "content": (
            "Inventory Health Summary — May 2026\n\n"
            "Total SKUs tracked: 3,412.\n"
            "2 SKUs in CRITICAL state — auto-replenishment PO triggered.\n"
            "  • SKU-118 (Dallas DC): 3 days of cover remaining.\n"
            "  • SKU-902 (Chicago DC): 2 days of cover remaining.\n"
            "12 SKUs overstocked in EU warehouses — $214K working-capital opportunity.\n"
            "Average days-of-cover across network: 21 days (target 18-25).\n"
            "Dead-stock candidates: 8 SKUs with zero movement in 90+ days."
        ),
    },
    {
        "source": "inventory/reorder-recommendations.md",
        "content": (
            "Reorder Recommendations — Generated 2026-05-14\n\n"
            "SKU-118: reorder 5,000 units from Supplier BetaChem (lead time 6 days).\n"
            "SKU-902: reorder 3,200 units from Supplier NovaParts (lead time 4 days).\n"
            "SKU-330: increase safety stock by 10% ahead of promo window.\n"
            "SKU-441: reduce next PO by 500 units — demand trending down.\n"
            "Estimated savings from right-sizing: $47K/month."
        ),
    },
    # ── Supplier Risk ──────────────────────────────────────────────────
    {
        "source": "risk/supplier-risk-assessment.md",
        "content": (
            "Supplier Risk Assessment — May 2026\n\n"
            "HIGH RISK: Supplier ACME-2241\n"
            "  • Lead-time variance >3σ over last 30 days.\n"
            "  • Quality reject rate: 4.1% (threshold 2%).\n"
            "  • Financial health score: C (Dun & Bradstreet).\n"
            "MEDIUM RISK: Supplier GammaTech\n"
            "  • Single-source dependency for SKU-770 family.\n"
            "  • Geopolitical exposure: Taiwan fab concentration.\n"
            "LOW RISK: Remaining 23 suppliers within normal parameters."
        ),
    },
    {
        "source": "risk/disruption-alerts-2026-w20.md",
        "content": (
            "Supply Chain Disruption Alerts — Week 20, 2026\n\n"
            "1. Port congestion at Long Beach +18% week-over-week.\n"
            "   Impact: 2-3 day delay on inbound APAC containers.\n"
            "2. Typhoon warning in South China Sea — potential 5-day port closure.\n"
            "   Affected suppliers: DeltaElec, SigmaComp.\n"
            "3. US-EU tariff revision effective June 1 — 8% increase on category 7.\n"
            "   Action: accelerate pre-June shipments for affected SKUs.\n"
            "4. Rail strike risk in Germany — contingency truck routing prepared."
        ),
    },
]


def seed_mock_data(rag_handler) -> int:
    """
    Seed the RAG vector store with mock supply-chain documents.

    Skips seeding if the collection already contains documents (idempotent).
    Returns the number of documents seeded (0 if already populated).
    """
    status = rag_handler.get_status()
    if status.get("documents_count", 0) > 0:
        print(
            f"[mock_data] Vector store already contains "
            f"{status['documents_count']} document(s) — skipping seed."
        )
        return 0

    count = rag_handler.add_documents(MOCK_DOCUMENTS)
    print(f"[mock_data] Seeded {count} mock supply-chain documents into ChromaDB.")
    return count
