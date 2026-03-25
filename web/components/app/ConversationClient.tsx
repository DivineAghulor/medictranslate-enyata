"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChatStore } from "@/components/app/chat-store";
import { FileUp, Trash2 } from "lucide-react";

export default function ConversationClient({ conversationId }: { conversationId: string }) {
  const { ensureThread, getThread, analyze } = useChatStore();

  const [question, setQuestion] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    ensureThread(conversationId);
  }, [conversationId, ensureThread]);

  const thread = getThread(conversationId);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread?.messages.length]);

  async function runAnalyze() {
    if (!selectedFile || !thread || isAnalyzing) return;
    setIsAnalyzing(true);
    analyze(conversationId, selectedFile, question);
    setQuestion("");
    setSelectedFile(null);
    setIsAnalyzing(false);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <section className="flex-1 overflow-auto px-4 py-6">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
          {(thread?.messages ?? []).map((m) => {
            const isAssistant = m.role === "assistant";
            return (
              <div key={m.id} className={cn("flex w-full", isAssistant ? "justify-start" : "justify-end")}>
                <div
                  className={cn(
                    "max-w-[90%] rounded-[var(--radius)] border px-4 py-3 text-sm leading-relaxed md:max-w-[75%]",
                    isAssistant ? "border-border bg-card" : "border-green-200 bg-green-50 text-slate-900"
                  )}
                >
                  <div className="whitespace-pre-wrap">{m.content}</div>
                  <div className="mt-2 text-[11px] text-muted-foreground">
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
          <div className="rounded-[var(--radius)] border border-border bg-card p-3">
            <div
              className={cn(
                "flex flex-col gap-3 rounded-[var(--radius)] border border-dashed px-4 py-4 transition-colors",
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
                  <div className="grid size-10 place-items-center rounded-[var(--radius)] bg-green-600/10 text-green-700">
                    <FileUp className="size-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Upload a lab result</div>
                    <div className="text-xs text-muted-foreground">
                      PDF, JPG, or PNG. Drag and drop or choose a file.
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    Choose file
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="application/pdf,image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                  />
                </div>
              </div>

              {selectedFile ? (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-[var(--radius)] bg-muted px-3 py-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{selectedFile.name}</div>
                    <div className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(0)} KB</div>
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
                className="min-h-[72px]"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                className="w-full bg-green-600 font-semibold text-white hover:bg-green-700 md:w-auto"
                onClick={runAnalyze}
                disabled={!selectedFile || !thread || isAnalyzing}
              >
                Analyze
              </Button>
            </div>
          </div>

          <div className="rounded-[var(--radius)] border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
            MedicTranslate provides educational guidance, not medical advice.
          </div>
        </div>
      </section>
    </div>
  );
}

