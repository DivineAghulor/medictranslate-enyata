import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="max-w-6xl mx-auto py-24 bg-slate-900 text-white relative overflow-hidden mt-12 mb-12 rounded-[var(--radius)]">
      <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-green-900/40 to-slate-900 z-0"></div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-4xl sm:text-5xl font-bold mb-6">
          Maximize Your Health Knowledge
        </h2>
        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
          Take control of your health data. Understand your lab results in
          seconds, not days.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button
            asChild
            size="lg"
            className="w-full bg-green-500 text-slate-900 shadow-lg transition-all hover:-translate-y-px hover:bg-green-400 hover:shadow-xl sm:w-auto"
          >
            <Link href="/signup">Get started</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full border-slate-600 bg-transparent text-white transition-all hover:border-slate-400 hover:bg-transparent sm:w-auto"
          >
            <Link href="/signup">Create Free Account</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
