export default function TrustBanner() {
  return (
    <div className="py-12 border-y border-gray-100 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">
          Built for the Buildathon by Enyata
        </p>
        <div className="flex justify-center gap-8 sm:gap-16 opacity-50 grayscale flex-wrap">
          <span className="text-xl font-bold text-slate-800">Enyata</span>
          <span className="text-xl font-bold text-slate-800">Buildathon</span>
          <span className="text-xl font-bold text-slate-800">Hackathon 2026</span>
        </div>
      </div>
    </div>
  );
}
