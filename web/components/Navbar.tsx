import Link from "next/link";

export default function Navbar() {
  return (
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
  );
}
