import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/page-header";
import { ChatWindow } from "@/components/chatbot/chat-window";
import { Sparkles, Brain, FileText, BarChart3, Workflow } from "lucide-react";
import { useChatbotStore } from "@/store/chatbot-store";

export const Route = createFileRoute("/ai-assistant")({
  head: () => ({
    meta: [
      { title: "AI Assistant · Nexus SCM" },
      { name: "description", content: "Full AI workspace for explainable analytics, recommendations, report generation, and dashboard control." },
    ],
  }),
  component: AssistantPage,
});

const capabilities = [
  { Icon: BarChart3, title: "Analytics queries", desc: "Ask anything about KPIs, trends, anomalies." },
  { Icon: Brain, title: "Explainable AI", desc: "Understand why each model made a decision." },
  { Icon: Sparkles, title: "Recommendations", desc: "Receive actionable suggestions across the network." },
  { Icon: FileText, title: "Report generation", desc: "Auto-generate executive briefings on demand." },
  { Icon: Workflow, title: "Dashboard control", desc: "Drive the platform with natural language commands." },
];

function AssistantPage() {
  const send = useChatbotStore((s) => s.send);
  const prompts = [
    "Generate this week's executive supply chain briefing.",
    "Why did the risk score for ACME-2241 spike?",
    "Compare forecast accuracy across regions for the last quarter.",
    "List all SKUs at critical stock and recommend reorder quantities.",
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="AI Workspace"
        title="Supply Chain Copilot"
        description="A full conversational workspace for analytics, explanations, recommendations, and natural-language control."
      />

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-surface shadow-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Capabilities</p>
            <div className="mt-3 space-y-3">
              {capabilities.map((c) => (
                <div key={c.title} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <c.Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface shadow-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Suggested prompts</p>
            <div className="mt-3 space-y-2">
              {prompts.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="w-full rounded-lg border border-border bg-surface-muted/50 px-3 py-2.5 text-left text-xs text-foreground transition hover:border-primary/40 hover:bg-primary-soft"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="h-[calc(100vh-220px)] min-h-[560px]">
          <ChatWindow embedded />
        </div>
      </div>
    </div>
  );
}
