import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-6xl mb-4">💊</div>
        <h1 className="text-3xl font-extrabold text-white mb-2">404</h1>
        <p className="text-slate-400 mb-6">This page doesn't exist in Pharma Core.</p>
        <Link href="/" className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-secondary font-bold text-white text-sm inline-block">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
