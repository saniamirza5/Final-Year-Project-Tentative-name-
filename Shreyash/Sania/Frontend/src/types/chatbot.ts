export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  insight?: {
    title: string;
    points: string[];
    confidence: number;
  };
}
