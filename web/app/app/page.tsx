"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  FileUp,
  MessageSquareText,
  Plus,
  ShieldCheck,
  Trash2,
  User,
} from "lucide-react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
};

type ChatThread = {
  id: string;
  title: string;
  updatedAt: number;
  messages: ChatMessage[];
};

const STORAGE_KEY = "medictranslate.chat.threads.v1";

function formatRelativeTime(timestamp: number) {
  const diffMs = Date.now() - timestamp;
  const diffMinutes = Math.round(diffMs / 60_000);
  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
}

function newId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function defaultThreads(): ChatThread[] {
  const now = Date.now();
  return [
    {
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
    },
  ];
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

export default function AppDashboardPage() {
  const [threads, setThreads] = React.useState<ChatThread[]>(() =>
    defaultThreads()
  );
  const [activeThreadId, setActiveThreadId] = React.useState<string | null>(
    null
  );

  const [question, setQuestion] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);

  const activeThread = React.useMemo(() => {
    const id = activeThreadId ?? threads[0]?.id ?? null;
    return id ? threads.find((t) => t.id === id) ?? null : null;
  }, [activeThreadId, threads]);

  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    const stored = safeParseThreads(localStorage.getItem(STORAGE_KEY));
    if (stored?.length) {
      setThreads(stored);
      setActiveThreadId(stored[0]?.id ?? null);
    }
  }, []);

  React.useEffect(() => {
    if (!activeThreadId && threads.length) {
      setActiveThreadId(threads[0]?.id ?? null);
    }
  }, [activeThreadId, threads]);

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
  }, [threads]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeThread?.messages.length]);

  function setActiveThreadById(id: string) {
    setActiveThreadId(id);
  }

  function createNewThread() {
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
            "Upload a lab report and I’ll explain the results in plain language.",
        },
      ],
    };
    setThreads((prev) => [next, ...prev]);
    setActiveThreadId(next.id);
    setSelectedFile(null);
    setQuestion("");
  }

  function deleteThread(id: string) {
    setThreads((prev) => {
      const next = prev.filter((t) => t.id !== id);
      return next.length ? next : defaultThreads();
    });
    setActiveThreadId((prev) => (prev === id ? null : prev));
  }

  async function analyze() {
    if (!activeThread || !selectedFile || isAnalyzing) return;

    setIsAnalyzing(true);
    const now = Date.now();
    const userMsg: ChatMessage = {
      id: newId(),
      role: "user",
      createdAt: now,
      content: `Uploaded: ${selectedFile.name}`,
    };
    const assistantMsg: ChatMessage = {
      id: newId(),
      role: "assistant",
      createdAt: now + 1,
      content: buildAssistantReply(selectedFile, question),
    };

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== activeThread.id) return t;
        const nextTitle =
          t.title === "New analysis" ? selectedFile.name : t.title;
        return {
          ...t,
          title: nextTitle,
          updatedAt: Date.now(),
          messages: [...t.messages, userMsg, assistantMsg],
        };
      })
    );

    setQuestion("");
    setSelectedFile(null);
    setIsAnalyzing(false);
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col md:flex-row">
        <aside className="flex w-full flex-col border-b border-sidebar-border bg-sidebar md:w-80 md:border-b-0 md:border-r">
          <div className="flex items-center justify-between gap-3 px-4 py-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="grid size-9 place-items-center rounded-(--radius) bg-green-600 text-sm font-bold text-white">
                M
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold tracking-tight">
                  MedicTranslate
                </div>
                <div className="text-xs text-muted-foreground">
                  Lab results chat
                </div>
              </div>
            </Link>

            <Button
              variant="outline"
              size="icon-sm"
              onClick={createNewThread}
              aria-label="New analysis"
              title="New analysis"
            >
              <Plus className="size-4" />
            </Button>
          </div>

          <div className="px-4 pb-4">
            <Link
              href="/profile"
              className="block rounded-(--radius) border border-sidebar-border bg-background p-3 hover:bg-muted"
            >
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-(--radius) bg-green-600/10 text-green-700">
                  <User className="size-5" />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">
                    Your profile
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    Manage account details
                  </div>
                </div>
              </div>
            </Link>

            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-4" />
              <span>Privacy-first uploads</span>
            </div>
          </div>

          <div className="px-4 pb-2 text-xs font-semibold text-muted-foreground">
            History
          </div>

          <div className="flex-1 overflow-auto px-2 pb-4">
            <div className="space-y-1">
              {threads.map((t) => {
                const isActive = t.id === (activeThread?.id ?? "");
                return (
                  <div
                    key={t.id}
                    className={cn(
                      "group flex items-center gap-2 rounded-(--radius) px-2 py-2",
                      isActive ? "bg-muted" : "hover:bg-muted/60"
                    )}
                  >
                    <button
                      type="button"
                      className="flex min-w-0 flex-1 items-center gap-2 text-left"
                      onClick={() => setActiveThreadById(t.id)}
                    >
                      <MessageSquareText className="size-4 shrink-0 text-muted-foreground" />
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">
                          {t.title || "Untitled"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatRelativeTime(t.updatedAt)}
                        </div>
                      </div>
                    </button>

                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="opacity-0 group-hover:opacity-100"
                      onClick={() => deleteThread(t.id)}
                      aria-label="Delete thread"
                      title="Delete"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        <main className="flex min-h-0 flex-1 flex-col">
          <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-4">
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">
                {activeThread?.title ?? "MedicTranslate"}
              </div>
              <div className="text-xs text-muted-foreground">
                Upload a report to get a clear explanation and guidance.
              </div>
            </div>

            <Link
              href="/profile"
              className="rounded-(--radius) border border-border bg-background px-3 py-2 text-sm hover:bg-muted"
            >
              Profile
            </Link>
          </header>

          <section className="flex-1 overflow-auto px-4 py-6">
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
              {(activeThread?.messages ?? []).map((m) => {
                const isAssistant = m.role === "assistant";
                return (
                  <div
                    key={m.id}
                    className={cn(
                      "flex w-full",
                      isAssistant ? "justify-start" : "justify-end"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[90%] rounded-(--radius) border px-4 py-3 text-sm leading-relaxed md:max-w-[75%]",
                        isAssistant
                          ? "border-border bg-card"
                          : "border-green-200 bg-green-50 text-slate-900"
                      )}
                    >
                      <div className="whitespace-pre-wrap">{m.content}</div>
                      <div className="mt-2 text-[11px] text-muted-foreground">
                        {new Date(m.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </section>

          <section className="border-t border-border bg-background px-4 py-4">
            <div className="mx-auto w-full max-w-3xl space-y-3">
              <div className="rounded-(--radius) border border-border bg-card p-3">
                <div
                  className={cn(
                    "flex flex-col gap-3 rounded-(--radius) border border-dashed px-4 py-4 transition-colors",
                    isDragging ? "border-green-400 bg-green-50" : "border-border"
                  )}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) setSelectedFile(file);
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="grid size-10 place-items-center rounded-(--radius) bg-green-600/10 text-green-700">
                        <FileUp className="size-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">
                          Upload a lab result
                        </div>
                        <div className="text-xs text-muted-foreground">
                          PDF, JPG, or PNG. Drag and drop or choose a file.
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Choose file
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="application/pdf,image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0] ?? null;
                          setSelectedFile(f);
                        }}
                      />
                    </div>
                  </div>

                  {selectedFile ? (
                    <div className="flex flex-wrap items-center justify-between gap-2 rounded-(--radius) bg-muted px-3 py-2">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">
                          {selectedFile.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {(selectedFile.size / 1024).toFixed(0)} KB
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => setSelectedFile(null)}
                        aria-label="Remove file"
                        title="Remove"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto] md:items-end">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Optional: what should I focus on?
                  </label>
                  <Textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="E.g., explain anything abnormal and what questions I should ask my doctor."
                    className="min-h-18 resize-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    className="w-full bg-green-600 font-semibold text-white hover:bg-green-700 md:w-auto"
                    onClick={analyze}
                    disabled={!selectedFile || !activeThread || isAnalyzing}
                  >
                    Analyze
                  </Button>
                </div>
              </div>

              <div className="rounded-(--radius) border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
                MedicTranslate provides educational guidance, not medical advice.
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
