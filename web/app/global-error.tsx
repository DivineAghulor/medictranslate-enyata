"use client";

import Link from "next/link";

import { dmSans } from "@/app/fonts";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="antialiased font-sans bg-background text-foreground">
        <main className="relative flex min-h-dvh items-center justify-center px-6 py-16">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-32 -top-40 size-[520px] rounded-full bg-linear-to-br from-green-500/20 via-emerald-400/10 to-transparent blur-3xl" />
            <div className="absolute -bottom-44 -right-40 size-[640px] rounded-full bg-linear-to-tr from-slate-700/20 via-slate-800/10 to-transparent blur-3xl" />
          </div>

          <section className="relative w-full max-w-xl rounded-[var(--radius)] border border-border bg-card/80 p-8 shadow-sm backdrop-blur md:p-10">
            <header className="flex items-center justify-between gap-3">
              <Link href="/" className="inline-flex items-center gap-2">
                <BrandLogo size={36} className="rounded-[var(--radius)]" />
                <span className="text-base font-semibold tracking-tight">
                  MedicTranslate
                </span>
              </Link>
              <div className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-muted-foreground">
                Error
              </div>
            </header>

            <h1 className="mt-8 text-3xl font-semibold tracking-tight md:text-4xl">
              Something went wrong
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
              Please try again. If the issue keeps happening, return to the home
              page and start a fresh session.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button onClick={() => reset()}>Try again</Button>
              <Button asChild variant="outline">
                <Link href="/">Go home</Link>
              </Button>
            </div>

            {process.env.NODE_ENV !== "production" ? (
              <div className="mt-7 rounded-[var(--radius)] border border-border bg-background p-4">
                <div className="text-xs font-semibold text-muted-foreground">
                  Debug info
                </div>
                <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-words text-xs text-foreground/80">
                  {error.message}
                  {error.digest ? `\nDigest: ${error.digest}` : ""}
                </pre>
              </div>
            ) : null}
          </section>
        </main>
      </body>
    </html>
  );
}

