import Link from "next/link";

import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center bg-background px-6 py-16 text-foreground">
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
            404
          </div>
        </header>

        <h1 className="mt-8 text-3xl font-semibold tracking-tight md:text-4xl">
          Page not found
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
          The link you followed doesn’t point to a page that exists. If you
          typed the address, double-check it and try again.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/">Go home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/app">Open the app</Link>
          </Button>
        </div>

        <p className="mt-7 text-xs text-muted-foreground">
          Need help? Start from the homepage and navigate from there.
        </p>
      </section>
    </main>
  );
}

