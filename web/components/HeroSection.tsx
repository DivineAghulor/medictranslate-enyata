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
            Start Free Trial
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

        {/* Hero Visual */}
        <div className="mt-16 sm:mt-24 relative max-w-4xl mx-auto h-100 sm:h-150 w-full bg-slate-50 rounded-[2rem] border-8 border-white shadow-2xl overflow-hidden flex items-center justify-center">
          {/* Background decorative glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-linear-to-tr from-green-50 via-emerald-50/40 to-white -z-10"></div>

          {/* Phone mockup */}
          <div className="w-70 h-145 bg-slate-900 rounded-[2.5rem] border-[6px] border-slate-800 relative shadow-2xl z-10 overflow-hidden flex flex-col pt-8 bg-white">
            {/* Dynamic Island */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-900 rounded-full z-20"></div>

            <div className="flex-1 w-full bg-slate-50 flex flex-col p-4 space-y-4 overflow-hidden">
              {/* Lab result header block */}
              <div className="w-full h-32 bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col justify-center">
                <div className="w-3/4 h-4 bg-gray-200 rounded mb-2"></div>
                <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
              </div>

              {/* Translated result block */}
              <div className="w-full h-48 bg-green-50 rounded-xl shadow-sm border border-green-100 p-4">
                <div className="w-1/3 h-6 bg-green-200 rounded mb-4"></div>
                <div className="w-full h-4 bg-green-100 rounded mb-2"></div>
                <div className="w-5/6 h-4 bg-green-100 rounded mb-2"></div>
                <div className="w-4/6 h-4 bg-green-100 rounded"></div>
              </div>

              {/* Progress block */}
              <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-3">
                <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-green-400 rounded-full"></div>
                </div>
                <div className="w-1/3 h-3 bg-green-100 rounded"></div>
              </div>
            </div>
          </div>

          {/* Floating left card */}
          <div className="absolute left-4 md:-left-12 top-1/4 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 z-20 w-48 hidden sm:block">
            <div className="text-xs text-gray-500 font-medium mb-1">
              Hemoglobin Level
            </div>
            <div className="text-2xl font-bold text-slate-800">
              14.2{" "}
              <span className="text-sm font-normal text-gray-400">g/dL</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full mt-3 overflow-hidden">
              <div className="w-2/3 h-full bg-green-500 rounded-full"></div>
            </div>
            <div className="text-xs text-green-600 font-medium mt-2">
              Within normal range
            </div>
          </div>

          {/* Floating right card */}
          <div className="absolute right-4 md:-right-12 bottom-1/4 bg-green-100 p-4 rounded-2xl shadow-xl border border-green-200 z-20 w-56 hidden sm:block">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs">
                OK
              </div>
              <div className="text-sm font-bold text-green-900">
                Normal Range
              </div>
            </div>
            <div className="text-xs text-green-800">
              Your white blood cell count looks good and is within normal
              limits.
            </div>
          </div>

          {/* Top right mini floating badge */}
          <div className="absolute right-6 top-6 bg-white px-3 py-2 rounded-xl shadow-md border border-gray-100 z-20 hidden sm:flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-semibold text-slate-700">
              AI Analysis Active
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
