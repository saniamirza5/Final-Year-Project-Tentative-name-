import { Sparkles } from "lucide-react";
import { useChatbotStore } from "@/store/chatbot-store";

export function ChatButton() {
  const toggle = useChatbotStore((s) => s.toggle);
  const open = useChatbotStore((s) => s.open);
  if (open) return null;
  return (
    <button
      onClick={toggle}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-gradient-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-elevated transition hover:scale-[1.03] hover:shadow-glow"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-foreground opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-foreground" />
      </span>
      <Sparkles className="h-4 w-4" />
      Ask AI
    </button>
  );
}
