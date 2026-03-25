import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/BrandLogo";

type AuthSplitLayoutProps = {
  /** Desktop placement only. Mobile always stacks hero on top, form below. */
  desktopVariant: "heroRight" | "heroLeft";
  title: string;
  description: string;
  /** If false, hides the hero panel on all breakpoints. */
  showHero?: boolean;
  children: ReactNode;
};

export default function AuthSplitLayout({
  desktopVariant,
  title,
  description,
  showHero = false,
  children,
}: AuthSplitLayoutProps) {
  if (!showHero) {
    return (
        <div className="min-h-dvh bg-white text-slate-900">
          <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-6 py-10">
          <Link href="/" className="mx-auto mb-8 inline-flex items-center gap-2">
            <BrandLogo size={40} className="rounded-[var(--radius)]" />
            <span className="text-lg font-semibold tracking-tight">
              MedicTranslate
            </span>
          </Link>

          <div className="mx-auto w-full max-w-sm">
            <div className="mb-7 text-center">
              <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    );
  }

  const heroMdOrder = desktopVariant === "heroRight" ? "md:order-2" : "md:order-1";
  const formMdOrder = desktopVariant === "heroRight" ? "md:order-1" : "md:order-2";

  return (
    <div className="min-h-dvh bg-white text-slate-900">
      <div className="mx-auto py-10 flex max-h-full max-w-6xl flex-col md:flex-row md:px-6">
        <section
          className={cn(
            "relative order-1 flex w-full flex-col justify-between overflow-hidden bg-slate-950 text-white md:min-h-dvh md:w-1/2 md:rounded-[var(--radius)]",
            heroMdOrder
          )}
        >
          <div className="pointer-events-none absolute -right-10 -top-16 size-[360px] rounded-full bg-linear-to-br from-green-500/25 via-emerald-400/10 to-transparent blur-2xl md:size-[520px]" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 size-[420px] rounded-full bg-linear-to-tr from-slate-700/30 via-slate-800/10 to-transparent blur-2xl md:size-[560px]" />
          <div className="pointer-events-none absolute right-8 top-6 hidden select-none md:block">
            <div className="text-[160px] font-bold leading-none text-white/10">
              M
            </div>
          </div>

          <div className="relative z-10 px-6 pb-8 pt-10 md:px-10 md:pt-12">
            <Link href="/" className="inline-flex items-center gap-2">
              <BrandLogo size={40} className="rounded-[var(--radius)]" />
              <span className="text-lg font-semibold tracking-tight">
                MedicTranslate
              </span>
            </Link>

            <div className="mt-10 max-w-md md:mt-14">
              <p className="text-sm font-medium text-white/70">Welcome</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                Understand your lab results instantly
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-white/70 md:text-base">
                Upload, extract, and translate complex medical terminology into
                clear, accessible health insights.
              </p>
            </div>
          </div>

          <div className="relative z-10 px-6 pb-10 md:px-10 md:pb-12">
            <div className="rounded-[var(--radius)] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <div className="text-sm font-semibold">
                Get started in minutes
              </div>
              <div className="mt-1 text-sm text-white/70">
                Create an account and start translating your reports with
                confidence.
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-white/60">
                <span className="inline-flex size-6 items-center justify-center rounded-[var(--radius)] bg-white/10">
                  ✓
                </span>
                <span>Privacy-first uploads</span>
                <span className="mx-1">•</span>
                <span>Easy explanations</span>
              </div>
            </div>
          </div>
        </section>

        <section
          className={cn(
            "order-2 flex w-full flex-col justify-center px-6 py-10 md:max-h-full md:w-1/2 md:px-10",
            formMdOrder
          )}
        >
          <div className="mx-auto w-full max-w-sm">
            <div className="mb-7">
              <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            </div>
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}
