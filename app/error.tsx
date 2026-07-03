"use client";
import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-extrabold text-white mb-2">Something went wrong</h1>
        <p className="text-slate-400 mb-6 text-sm">{error.message || "An unexpected error occurred in Pharma Core."}</p>
        <button onClick={reset}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-secondary font-bold text-white text-sm">
          Try Again
        </button>
      </div>
    </div>
  );
}
