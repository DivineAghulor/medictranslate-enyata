import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-green-100 selection:text-green-900">
      {/* Navbar */}
      <nav className="fixed w-full top-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center text-white font-bold text-xl">
              M
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              MedicTranslate
            </span>
          </div>
          <div className="hidden md:flex space-x-8">
            <Link
              href="#features"
              className="text-gray-600 hover:text-green-600 font-medium transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-gray-600 hover:text-green-600 font-medium transition-colors"
            >
              How it Works
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/app"
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-full font-medium transition-all shadow-sm"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
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
            ⚠️ MedicTranslate is for health education and guidance only. It is
            not a replacement for licensed medical professionals.
          </p>

          {/* Hero Image / Abstract Visual */}
          <div className="mt-16 sm:mt-24 relative max-w-4xl mx-auto h-[400px] sm:h-[600px] w-full bg-slate-50 rounded-[2rem] border-[8px] border-white shadow-2xl overflow-hidden flex items-center justify-center">
            {/* Background decorative glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-green-50 via-emerald-50/40 to-white -z-10"></div>

            {/* Phone mockup placeholder */}
            <div className="w-[280px] h-[580px] bg-slate-900 rounded-[2.5rem] border-[6px] border-slate-800 relative shadow-2xl z-10 overflow-hidden flex flex-col pt-8 bg-white">
              {/* Dynamic Island */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-900 rounded-full z-20"></div>

              <div className="flex-1 w-full bg-slate-50 flex flex-col p-4 space-y-4 overflow-hidden">
                {/* Mock UI Elements */}
                <div className="w-full h-32 bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col justify-center">
                  <div className="w-3/4 h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="w-full h-48 bg-green-50 rounded-xl shadow-sm border border-green-100 p-4">
                  <div className="w-1/3 h-6 bg-green-200 rounded mb-4"></div>
                  <div className="w-full h-4 bg-green-100 rounded mb-2"></div>
                  <div className="w-5/6 h-4 bg-green-100 rounded mb-2"></div>
                  <div className="w-4/6 h-4 bg-green-100 rounded"></div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
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
            </div>

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
          </div>
        </div>
      </main>

      {/* Trust Banner */}
      <div className="py-12 border-y border-gray-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">
            Built for the Buildathon by Enyata
          </p>
          <div className="flex justify-center gap-8 sm:gap-16 opacity-50 grayscale flex-wrap">
            <span className="text-xl font-bold text-slate-800">Enyata</span>
            <span className="text-xl font-bold text-slate-800">Buildathon</span>
            <span className="text-xl font-bold text-slate-800">
              Hackathon 2026
            </span>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Making health knowledge accessible
            </h2>
            <p className="text-xl text-gray-500">
              Many people receive lab reports that are difficult to interpret
              without medical training. MedicTranslate addresses this
              seamlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-6 text-2xl">
                📷
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Upload Images
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Easily upload an image of your lab test result. Our system
                processes and extracts the relevant medical values and text.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-6 text-2xl">
                🗣️
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Clear Translations
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We translate complex medical terminology into user-friendly
                explanations so you understand exactly what it means.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-6 text-2xl">
                🧭
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Health Insights
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Get context around the likely significance of values and
                guidance on when to seek professional hospital care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden mt-12 mb-12 mx-4 sm:mx-6 lg:mx-8 rounded-[3rem]">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-900/40 to-slate-900 z-0"></div>
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

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-green-600 flex items-center justify-center text-white font-bold text-xs">
              M
            </div>
            <span className="font-bold text-lg text-slate-900">
              MedicTranslate
            </span>
          </div>
          <div className="text-sm text-gray-500 text-center md:text-left">
            Built for the Buildathon by Enyata. Open Source Submission.
          </div>
          <div className="flex space-x-6">
            <Link
              href="#"
              className="text-gray-400 hover:text-green-600 transition-colors"
            >
              Twitter
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-green-600 transition-colors"
            >
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
