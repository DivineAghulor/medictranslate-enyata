"use client";

import * as React from "react";
import { useParams, usePathname } from "next/navigation";
import AppSidebar from "@/components/app/AppSidebar";
import { ChatStoreProvider, useChatStore } from "@/components/app/chat-store";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

function AppShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams<{ conversationId?: string }>();
  const conversationId =
    typeof params?.conversationId === "string" ? params.conversationId : null;

  const { threads, hydrated, getThread } = useChatStore();
  const activeId = conversationId;
  const activeTitle = activeId ? getThread(activeId)?.title : undefined;

  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="h-dvh overflow-hidden bg-background text-foreground">
      <div className="mx-auto flex h-full w-full flex-col md:flex-row">
        <AppSidebar activeThreadId={activeId} className="hidden md:flex" />

        {sidebarOpen ? (
          <div className="fixed inset-0 z-50 md:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/30"
              aria-label="Close menu"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] border-r border-sidebar-border bg-sidebar">
              <div className="flex items-center justify-end px-3 py-3">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="size-4" />
                </Button>
              </div>
              <AppSidebar
                activeThreadId={activeId}
                onNavigate={() => setSidebarOpen(false)}
                sidebarId="app-sidebar-drawer"
                className="border-b-0 md:hidden"
              />
            </div>
          </div>
        ) : null}

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-4">
            <div className="flex min-w-0 items-center gap-3">
              <Button
                variant="outline"
                size="icon-sm"
                className="md:hidden"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
                aria-controls="app-sidebar-drawer"
                aria-expanded={sidebarOpen}
              >
                <Menu className="size-4" />
              </Button>

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
