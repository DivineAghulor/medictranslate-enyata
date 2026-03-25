"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import AppSidebar from "@/components/app/AppSidebar";
import { ChatStoreProvider, useChatStore } from "@/components/app/chat-store";

function AppShellInner({ children }: { children: React.ReactNode }) {
  const params = useParams<{ conversationId?: string }>();
  const conversationId =
    typeof params?.conversationId === "string" ? params.conversationId : null;

  const { threads, hydrated, getThread } = useChatStore();
  const activeId = conversationId;
  const activeTitle = activeId ? getThread(activeId)?.title : undefined;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto flex min-h-dvh w-full flex-col md:flex-row">
        <AppSidebar activeThreadId={activeId} />

        <main className="flex min-h-0 flex-1 flex-col">
          <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-4">
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">
                {activeTitle ?? "New analysis"}
              </div>
              <div className="text-xs text-muted-foreground">
                {hydrated
                  ? threads.length
                    ? "Pick a conversation from history or start a new analysis."
                    : "Start by uploading a report to get a clear explanation and guidance."
                  : "Loading your history..."}
              </div>
            </div>
          </header>

          {children}
        </main>
      </div>
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ChatStoreProvider>
      <AppShellInner>{children}</AppShellInner>
    </ChatStoreProvider>
  );
}
