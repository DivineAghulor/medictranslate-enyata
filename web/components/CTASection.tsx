import Link from "next/link";

export default function CTASection() {
  return (
    <section className="max-w-6xl mx-auto py-24 bg-slate-900 text-white relative overflow-hidden mt-12 mb-12  rounded-[3rem]">
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
          <Link
            href="/app"
            className="w-full sm:w-auto px-8 py-4 bg-green-500 hover:bg-green-400 text-slate-900 rounded-full font-bold text-lg transition-all shadow-lg"
          >
            Start Free Trial
          </Link>
          <Link
            href="/signup"
            className="w-full sm:w-auto px-8 py-4 bg-transparent border border-slate-600 hover:border-slate-400 text-white rounded-full font-semibold text-lg transition-all"
          >
            Create Free Account
          </Link>
        </div>
      </div>
    </section>
  );
}
