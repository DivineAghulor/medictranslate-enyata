"use client";

import * as React from "react";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
};

export type ChatThread = {
  id: string;
  title: string;
  updatedAt: number;
  messages: ChatMessage[];
};

type ChatStore = {
  hydrated: boolean;
  threads: ChatThread[];
  getThread: (id: string) => ChatThread | undefined;
  createThread: () => string;
  ensureThread: (id: string) => void;
  deleteThread: (id: string) => string | null;
  analyze: (threadId: string, file: File, question: string) => void;
};

const STORAGE_KEY = "medictranslate.chat.threads.v1";

function newId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function safeParseThreads(raw: string | null): ChatThread[] | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    return parsed as ChatThread[];
  } catch {
    return null;
  }
}

function buildAssistantReply(file: File, question: string) {
  const name = file.name || "your document";
  const kind = file.type
    ? file.type.toUpperCase()
    : name.split(".").pop()?.toUpperCase() || "FILE";
  const userQuestion = question.trim();

  return [
    `Got it — I received ${name} (${kind}).`,
    "",
    "Here’s what I can do next:",
    "- Explain common test names and abbreviations",
    "- Point out results that are typically “high/low” (when values are provided)",
    "- Give context and practical questions to ask your clinician",
    "",
    userQuestion
      ? `You asked: “${userQuestion}”. I’ll focus the summary around that.`
      : "If you tell me what you’re worried about (e.g., cholesterol, liver, kidney, blood sugar), I’ll tailor the explanation.",
    "",
    "Important: This isn’t a diagnosis. If you have severe symptoms (chest pain, trouble breathing, fainting, severe bleeding), seek urgent care.",
  ].join("\n");
}

const ChatStoreContext = React.createContext<ChatStore | null>(null);

export function ChatStoreProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = React.useState(false);
  const [threads, setThreads] = React.useState<ChatThread[]>(() => []);

  React.useEffect(() => {
    const stored = safeParseThreads(localStorage.getItem(STORAGE_KEY));
    if (stored?.length) {
      setThreads(stored);
    }
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
  }, [hydrated, threads]);

  const getThread = React.useCallback(
    (id: string) => threads.find((t) => t.id === id),
    [threads]
  );

  const createThread = React.useCallback(() => {
    const now = Date.now();
    const next: ChatThread = {
      id: newId(),
      title: "New analysis",
      updatedAt: now,
      messages: [
        {
          id: newId(),
          role: "assistant",
          createdAt: now,
          content:
            "Upload your lab result (PDF or image) and I’ll translate the medical terms into clear language, highlight what stands out, and suggest next steps.",
        },
      ],
    };
    setThreads((prev) => [next, ...prev]);
    return next.id;
  }, []);

  const ensureThread = React.useCallback((id: string) => {
    setThreads((prev) => {
      if (prev.some((t) => t.id === id)) return prev;
      const now = Date.now();
      const next: ChatThread = {
        id,
        title: "New analysis",
        updatedAt: now,
        messages: [
          {
            id: newId(),
            role: "assistant",
            createdAt: now,
            content:
              "Upload a lab report and I’ll translate it into plain language.",
          },
        ],
      };
      return [next, ...prev];
    });
  }, []);

  const deleteThread = React.useCallback((id: string) => {
    let nextActiveId: string | null = null;
    setThreads((prev) => {
      const remaining = prev.filter((t) => t.id !== id);
      nextActiveId = remaining[0]?.id ?? null;
      return remaining;
    });
    return nextActiveId;
  }, []);

  const analyze = React.useCallback(
    (threadId: string, file: File, question: string) => {
      const now = Date.now();
      const userMsg: ChatMessage = {
        id: newId(),
        role: "user",
        createdAt: now,
        content: `Uploaded: ${file.name}`,
      };
      const assistantMsg: ChatMessage = {
        id: newId(),
        role: "assistant",
        createdAt: now + 1,
        content: buildAssistantReply(file, question),
      };

      setThreads((prev) =>
        prev.map((t) => {
          if (t.id !== threadId) return t;
          const nextTitle = t.title === "New analysis" ? file.name : t.title;
          return {
            ...t,
            title: nextTitle,
            updatedAt: Date.now(),
            messages: [...t.messages, userMsg, assistantMsg],
          };
        })
      );
    },
    []
  );

  const value = React.useMemo<ChatStore>(
    () => ({
      hydrated,
      threads,
      getThread,
      createThread,
      ensureThread,
      deleteThread,
      analyze,
    }),
    [analyze, createThread, deleteThread, ensureThread, getThread, hydrated, threads]
  );

  return (
    <ChatStoreContext.Provider value={value}>
      {children}
    </ChatStoreContext.Provider>
  );
}

export function useChatStore() {
  const ctx = React.useContext(ChatStoreContext);
  if (!ctx) throw new Error("useChatStore must be used within ChatStoreProvider");
  return ctx;
}

export function formatRelativeTime(timestamp: number) {
  const diffMs = Date.now() - timestamp;
  const diffMinutes = Math.round(diffMs / 60_000);
  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
}
