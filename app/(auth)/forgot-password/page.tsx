"use client";
import { useState } from "react";
import Link from "next/link";
import { resetPassword } from "@/lib/firebase/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy,  setBusy]  = useState(false);
  const [sent,  setSent]  = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError("");
    try { await resetPassword(email); setSent(true); }
    catch (err: any) { setError(err.message.replace("Firebase: ", "").replace(/\(.*\)/, "").trim()); }
    finally { setBusy(false); }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary flex items-center justify-center text-3xl mx-auto mb-3">💊</div>
        <h1 className="text-2xl font-extrabold text-white">Reset Password</h1>
        <p className="text-sm text-slate-400 mt-1">Enter your email to receive a reset link</p>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
        {sent ? (
          <div className="text-center space-y-4">
            <div className="text-5xl">📧</div>
            <p className="text-white font-semibold">Reset email sent!</p>
            <p className="text-slate-400 text-sm">Check your inbox and follow the link to reset your password.</p>
            <Link href="/login" className="block w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-secondary font-bold text-white text-sm text-center">
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/12 text-white placeholder-slate-500 outline-none focus:border-primary-500 transition-colors text-sm" />
            </div>
            {error && <div className="bg-red-500/15 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>}
            <button type="submit" disabled={busy}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-secondary font-bold text-white text-sm disabled:opacity-60">
              {busy ? "Sending…" : "Send Reset Email"}
            </button>
            <Link href="/login" className="block text-center text-sm text-slate-400 hover:text-slate-300">← Back to Sign In</Link>
          </form>
        )}
      </div>
    </div>
  );
}
