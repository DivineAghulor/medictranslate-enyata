"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { formatRelativeTime, useChatStore } from "@/components/app/chat-store";
import { BrandLogo } from "@/components/BrandLogo";
import {
  MessageSquareText,
  Plus,
  ShieldCheck,
  Trash2,
  User,
} from "lucide-react";

export default function AppSidebar({
  activeThreadId,
  onNavigate,
  className,
  sidebarId,
}: {
  activeThreadId: string | null;
  onNavigate?: () => void;
  className?: string;
  sidebarId?: string;
}) {
  const router = useRouter();
  const { threads, createThread, deleteThread } = useChatStore();

  return (
    <aside
      id={sidebarId}
      className={cn(
        "flex w-full flex-col border-b border-sidebar-border bg-sidebar md:w-80 md:border-b-0 md:border-r",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-4">
        <Link href="/" className="inline-flex items-center gap-2">
          <BrandLogo size={36} className="rounded-(--radius)" />
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
          onClick={() => {
            const id = createThread();
            router.push(`/app/${id}`);
            onNavigate?.();
          }}
          aria-label="New analysis"
          title="New analysis"
        >
          <Plus className="size-4" />
        </Button>
      </div>

      <div className="shrink-0 px-4 pb-4">
        <Link
          href="/profile"
          className="block rounded-(--radius) border border-sidebar-border bg-background p-3 hover:bg-muted"
          onClick={() => onNavigate?.()}
        >
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-(--radius) bg-green-600/10 text-green-700">
              <User className="size-5" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">Your profile</div>
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

      <div className="shrink-0 px-4 pb-2 text-xs font-semibold text-muted-foreground">
        History
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2 pb-4">
        <div className="space-y-1">
          {threads.length === 0 ? (
            <div className="px-4 pb-2 text-sm text-muted-foreground">
              No conversations yet
            </div>
          ) : (
            threads.map((t, index) => {
              const isActive = Boolean(
                activeThreadId && t.id === activeThreadId,
              );
              return (
                <div
                  key={index}
                  className={cn(
                    "group flex items-center gap-2 rounded-(--radius) px-2 py-2",
                    isActive ? "bg-muted" : "hover:bg-muted/60",
                  )}
                >
                  <button
                    type="button"
                    className="flex min-w-0 flex-1 items-center gap-2 text-left"
                    onClick={() => {
                      router.push(`/app/${t.id}`);
                      onNavigate?.();
                    }}
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
                    onClick={() => {
                      const nextId = deleteThread(t.id);
                      if (t.id === activeThreadId) {
                        router.push(nextId ? `/app/${nextId}` : "/app");
                        onNavigate?.();
                      }
                    }}
                    aria-label="Delete thread"
                    title="Delete"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </aside>
  );
}
