import { useState } from "react";
import type { Attachment, Message } from "../../lib/types";

/** Conversation state only. The preview acknowledgement is NOT a tool result. */
export function useConversation() {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  function acknowledgeRequest(files: Attachment[], reply: string): boolean {
    const text = draft.trim();
    if (!text) return false;
    setMessages((previous) => [
      ...previous,
      {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
        attachmentNames: files.map((file) => file.file.name),
      },
      { id: crypto.randomUUID(), role: "lexi", content: reply },
    ]);
    setDraft("");
    setHasStarted(true);
    return true;
  }
  function resetConversation() {
    setHasStarted(false);
    setMessages([]);
    setDraft("");
  }
  return {
    draft,
    setDraft,
    messages,
    hasStarted,
    setHasStarted,
    acknowledgeRequest,
    resetConversation,
  };
}
