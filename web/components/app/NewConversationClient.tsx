"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  FileUp,
  SendIcon,
  Trash2,
  Image as ImageIcon,
  FileText,
  Loader2,
} from "lucide-react";
import { isImageFile, makeId } from "@/utils/conversation";
import { SelectedFileItem } from "@/types/conversation";
import {
  analyzeLabFile,
  type LabInsight,
} from "@/lib/actions/analyze-lab-file";

type RenderableContent =
  | { kind: "text"; text: string }
  | { kind: "insight"; data: LabInsight };

type ChatBubble = {
  id: string;
  role: "user" | "assistant";
  content: RenderableContent;
  createdAt: number;
};

function newId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function stringifyItem(item: unknown): string {
  if (typeof item === "string") return item;
  if (item == null) return "";
  if (typeof item === "number" || typeof item === "boolean")
    return String(item);
  try {
    return JSON.stringify(item);
  } catch {
    return String(item);
  }
}

export default function NewConversationClient() {
  const [prompt, setPrompt] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<SelectedFileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [messages, setMessages] = useState<ChatBubble[]>([
    {
      id: "welcome-assistant-message",
      role: "assistant",
      createdAt: 0,
      content: {
        kind: "text",
        text: "Upload your lab image (PNG/JPG) and I’ll analyze it for you. You can also add a focus note before sending.",
      },
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming || incoming.length === 0) return;

    setSelectedFiles((prev) => {
      const existing = new Map<string, SelectedFileItem>();
      for (const item of prev) existing.set(item.id, item);

      for (const file of Array.from(incoming)) {
        const id = makeId(file);
        if (!existing.has(id)) {
          existing.set(id, {
            id,
            file,
            previewUrl: isImageFile(file)
              ? URL.createObjectURL(file)
              : undefined,
          });
        }
      }

      return Array.from(existing.values());
    });
  };

  const removeFileById = (idToRemove: string) => {
    setSelectedFiles((prev) => {
      const toRemove = prev.find((item) => item.id === idToRemove);
      if (toRemove?.previewUrl) URL.revokeObjectURL(toRemove.previewUrl);
      return prev.filter((item) => item.id !== idToRemove);
    });
  };

  const clearAllFiles = () => {
    setSelectedFiles((prev) => {
      for (const item of prev) {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      }
      return [];
    });
  };

  const scrollToEnd = () => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  };

  const submitAnalysis = async () => {
    if (!selectedFiles.length || isSubmitting) return;

    setIsSubmitting(true);

    const now = Date.now();
    const userSummary = [
      `Uploaded ${selectedFiles.length} file${selectedFiles.length > 1 ? "s" : ""}:`,
      ...selectedFiles.map((f) => `• ${f.file.name}`),
      prompt.trim() ? "" : "",
      prompt.trim() ? `Focus: ${prompt.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    setMessages((prev) => [
      ...prev,
      {
        id: newId(),
        role: "user",
        createdAt: now,
        content: { kind: "text", text: userSummary },
      },
      {
        id: "loading-analysis-message",
        role: "assistant",
        createdAt: now + 1,
        content: { kind: "text", text: "Analyzing your files..." },
      },
    ]);
    scrollToEnd();

    const currentFiles = [...selectedFiles];

    for (const item of currentFiles) {
      const result = await analyzeLabFile(item.file);

      setMessages((prev) => {
        const next = [...prev];
        const loadingIndex = next.findIndex(
          (m) => m.id === "loading-analysis-message",
        );
        if (loadingIndex >= 0) next.splice(loadingIndex, 1);

        if (result.ok) {
          next.push({
            id: newId(),
            role: "assistant",
            createdAt: Date.now(),
            content: { kind: "insight", data: result.data },
          });
        } else {
          next.push({
            id: newId(),
            role: "assistant",
            createdAt: Date.now(),
            content: {
              kind: "text",
              text: `Could not analyze "${item.file.name}": ${result.message}`,
            },
          });
        }

        return next;
      });

      scrollToEnd();
    }

    clearAllFiles();
    setPrompt("");
    setIsSubmitting(false);
  };

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col rounded-(--radius) border border-transparent transition-colors",
        isDragging && "border-dashed border-green-400 bg-green-50/40",
      )}
      onDragEnter={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsDragging(false);
        }
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        addFiles(e.dataTransfer.files);
      }}
    >
      <section className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-6">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
          {messages.map((m) => {
            const isAssistant = m.role === "assistant";
            return (
              <div
                key={m.id}
                className={cn(
                  "flex w-full",
                  isAssistant ? "justify-start" : "justify-end",
                )}
              >
                <div
                  className={cn(
                    "max-w-[90%] rounded-(--radius) border px-4 py-3 text-sm leading-relaxed md:max-w-[75%]",
                    isAssistant
                      ? "border-border bg-card"
                      : "border-green-200 bg-green-50 text-slate-900",
                  )}
                >
                  {m.content.kind === "text" ? (
                    <div className="whitespace-pre-wrap">{m.content.text}</div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Big picture
                        </div>
                        <div className="mt-1 whitespace-pre-wrap">
                          {m.content.data.big_picture || "No summary provided."}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Good results
                        </div>
                        {m.content.data.good_results.length ? (
                          <ul className="mt-1 list-disc space-y-1 pl-5">
                            {m.content.data.good_results.map((item, i) => (
                              <li key={`good-${i}`}>{stringifyItem(item)}</li>
                            ))}
                          </ul>
                        ) : (
                          <div className="mt-1 text-muted-foreground">
                            None listed.
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Areas of attention
                        </div>
                        {m.content.data.areas_of_attention.length ? (
                          <ul className="mt-1 list-disc space-y-1 pl-5">
                            {m.content.data.areas_of_attention.map(
                              (item, i) => (
                                <li key={`attention-${i}`}>
                                  {stringifyItem(item)}
                                </li>
                              ),
                            )}
                          </ul>
                        ) : (
                          <div className="mt-1 text-muted-foreground">
                            None listed.
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Next steps
                        </div>
                        <div className="mt-1 whitespace-pre-wrap">
                          {m.content.data.next_steps ||
                            "No next steps provided."}
                        </div>
                      </div>

                      <div className="rounded-(--radius) bg-muted px-3 py-2 text-xs text-muted-foreground">
                        {m.content.data.disclaimer ||
                          "For educational purposes only."}
                      </div>
                    </div>
                  )}

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

      <section className="flex-1 px-4 py-6">
        <div className="mx-auto flex h-full w-full max-w-3xl items-center">
          <div className="w-full space-y-3 rounded-(--radius) border bg-card p-4">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin pb-1">
              {selectedFiles.length > 0 && (
                <div className="flex items-center gap-2">
                  {selectedFiles.map((item) => (
                    <div
                      key={item.id}
                      className="flex min-w-52.5 max-w-65 items-center gap-2 rounded-(--radius) bg-muted px-2 py-2"
                    >
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-background">
                        {item.previewUrl ? (
                          <img
                            src={item.previewUrl}
                            alt={item.file.name}
                            className="size-full object-cover"
                          />
                        ) : (
                          <div className="grid size-full place-items-center text-muted-foreground">
                            {item.file.type === "application/pdf" ? (
                              <FileText className="size-5" />
                            ) : (
                              <ImageIcon className="size-5" />
                            )}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">
                          {item.file.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {(item.file.size / 1024).toFixed(0)} KB
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        aria-label={`Remove ${item.file.name}`}
                        title="Remove"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeFileById(item.id);
                        }}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-end justify-between gap-5 md:gap-10">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., explain anything abnormal and what I should do next."
                className="max-h-24 resize-none rounded-none border-none p-0 text-sm outline-none"
              />
            </div>

            <div
              className="flex cursor-pointer items-center justify-between"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
            >
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-3 rounded-(--radius) bg-gray-50 px-4 py-3 hover:bg-gray-100 min-w-52.5 max-w-full"
              >
                <div className="grid place-items-center rounded-(--radius) bg-green-600/10 text-green-700">
                  <FileUp className="size-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold">
                    Upload lab results
                  </div>
                  <div className="text-xs text-muted-foreground">PNG & JPG</div>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon-lg"
                aria-label="Analyze"
                title="Analyze"
                className="rounded-full bg-gray-100 text-green-900 hover:bg-gray-300"
                disabled={!selectedFiles.length || isSubmitting}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  submitAnalysis();
                }}
              >
                {isSubmitting ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <SendIcon className="size-5" />
                )}
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/jpeg,image/png"
                multiple
                onChange={(e) => {
                  addFiles(e.target.files);
                  e.currentTarget.value = "";
                }}
              />
            </div>

            <div className="px-4 py-3 text-center text-xs text-muted-foreground">
              MedicTranslate provides educational guidance, not medical advice.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
