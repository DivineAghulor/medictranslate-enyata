"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/components/app/chat-store";
import { FileUp, Trash2 } from "lucide-react";

export default function NewConversationClient() {
  const router = useRouter();
  const { createThread, analyze } = useChatStore();

  const [prompt, setPrompt] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  function runAnalyze() {
    if (!selectedFile || isAnalyzing) return;
    setIsAnalyzing(true);
    const id = createThread();
    analyze(id, selectedFile, prompt);
    router.push(`/app/${id}`);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <section className="flex-1 overflow-auto px-4 py-6">
        <div className="mx-auto w-full max-w-3xl">
          <div className="rounded-[var(--radius)] border border-border bg-card p-5">
            <div className="text-sm font-semibold">Start a new analysis</div>
            <div className="mt-1 text-sm text-muted-foreground">
              Upload a lab result, then add a short note if you want me to focus on something specific.
            </div>
          </div>
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
                Message (optional)
              </label>
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., explain anything abnormal and what I should do next."
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                className="w-full bg-green-600 font-semibold text-white hover:bg-green-700 md:w-auto"
                onClick={runAnalyze}
                disabled={!selectedFile || isAnalyzing}
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

