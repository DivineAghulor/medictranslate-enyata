import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white py-12 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-[var(--radius)] bg-green-600 flex items-center justify-center text-white font-bold text-xs">
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
  );
}
