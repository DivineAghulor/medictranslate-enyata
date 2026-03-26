"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChatStore } from "@/components/app/chat-store";
import { FileText, FileUp, ImageIcon, SendIcon, Trash2 } from "lucide-react";
import { SelectedFileItem } from "@/types/conversation";
import { isImageFile, makeId } from "@/utils/conversation";

export default function ConversationClient({
  conversationId,
}: {
  conversationId: string;
}) {
  const { ensureThread, getThread, analyze } = useChatStore();

  const [question, setQuestion] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    ensureThread(conversationId);
  }, [conversationId, ensureThread]);

  const thread = getThread(conversationId);

  const [prompt, setPrompt] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<SelectedFileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const openFilePicker = () => {
    const input = fileInputRef.current;
    if (!input) return;
    input.value = "";
    if ("showPicker" in input && typeof input.showPicker === "function") {
      input.showPicker();
      return;
    }
    input.click();
  };

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
      if (toRemove?.previewUrl) {
        URL.revokeObjectURL(toRemove.previewUrl);
      }
      return prev.filter((item) => item.id !== idToRemove);
    });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread?.messages.length]);

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
          {(thread?.messages ?? []).map((m) => {
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
              onClick={openFilePicker}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openFilePicker();
                }
              }}
            >
              <div
                className="px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-(--radius) flex items-center gap-3 min-w-52.5 max-w-full"
              >
                <div className="grid place-items-center rounded-(--radius) bg-green-600/10 text-green-700">
                  <FileUp className="size-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold">
                    Upload lab results
                  </div>
                  <div className="text-xs text-muted-foreground">
                    PDF & Images
                  </div>
                </div>
              </div>

              <div className="color-white flex place-items-center items-center gap-2 rounded-full bg-gray-100 p-2 text-green-900 hover:bg-gray-300">
                <SendIcon />
              </div>

              <input
                ref={fileInputRef}
                type="file"
                className="sr-only"
                accept="application/pdf,image/*"
                multiple
                onClick={(e) => {
                  e.currentTarget.value = "";
                }}
                onChange={(e) => {
                  addFiles(e.target.files);
                  e.currentTarget.value = "";
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
