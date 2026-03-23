import Link from "next/link";

export default function HeroSection() {
  return (
    <main className="pt-32 pb-16 sm:pt-40 sm:pb-24 lg:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tight text-slate-900 mb-6 leading-tight">
          Understand Your <br className="hidden sm:block" />
          Lab Results Instantly
        </h1>
        <p className="mt-4 text-xl sm:text-2xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          From upload to understanding — translate complex medical terminology
          into clear, accessible health insights right away.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            href="/app"
            className="w-full sm:w-auto px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            Get started
          </Link>
          <Link
            href="#how-it-works"
            className="w-full sm:w-auto px-8 py-4 bg-white border border-gray-200 hover:border-gray-300 text-slate-900 rounded-full font-semibold text-lg transition-all"
          >
            Create Free Account
          </Link>
        </div>
        <p className="mt-6 text-sm text-gray-400 font-medium max-w-md mx-auto">
          ⚠️ MedicTranslate is for health education and guidance only. It is not
          a replacement for licensed medical professionals.
        </p>
      </div>
    </main>
  );
}
