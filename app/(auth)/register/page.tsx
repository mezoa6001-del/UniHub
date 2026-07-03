"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUpWithEmail, signInWithGoogle } from "@/lib/firebase/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [busy,     setBusy]     = useState(false);
  const [error,    setError]    = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setBusy(true); setError("");
    try {
      await signUpWithEmail(email, password, name);
      router.push("/");
    } catch (err: any) {
      setError(err.message.replace("Firebase: ", "").replace(/\(.*\)/, "").trim());
    } finally { setBusy(false); }
  };

  const handleGoogle = async () => {
    setBusy(true); setError("");
    try { await signInWithGoogle(); router.push("/"); }
    catch (err: any) { setError(err.message); }
    finally { setBusy(false); }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary flex items-center justify-center text-2xl">💊</div>
          <div className="text-left">
            <h1 className="text-2xl font-extrabold text-white">Pharma Core</h1>
            <p className="text-xs text-secondary font-bold tracking-widest uppercase">by Dr. Mazen Ashraf</p>
          </div>
        </div>
        <p className="text-sm text-slate-400 mt-2">Create your account and start learning</p>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Full Name",  type: "text",     val: name,     set: setName,     ph: "Dr. Mazen Ashraf" },
            { label: "Email",      type: "email",    val: email,    set: setEmail,    ph: "your@email.com" },
            { label: "Password",   type: "password", val: password, set: setPassword, ph: "Min. 6 characters" },
          ].map(({ label, type, val, set, ph }) => (
            <div key={label}>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{label}</label>
              <input type={type} value={val} onChange={(e) => set(e.target.value)} required placeholder={ph}
                className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/12 text-white placeholder-slate-500 outline-none focus:border-primary-500 transition-colors text-sm" />
            </div>
          ))}

          {error && (
            <div className="bg-red-500/15 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>
          )}

          <button type="submit" disabled={busy}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-secondary font-bold text-white text-sm disabled:opacity-60 hover:opacity-90 transition-opacity">
            {busy ? "Creating account…" : "Create Account →"}
          </button>
        </form>

        <div className="relative my-5">
          <hr className="border-white/10" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0F1B2D] px-3 text-xs text-slate-500">OR</span>
        </div>

        <button onClick={handleGoogle} disabled={busy}
          className="w-full py-3 rounded-xl border border-white/12 bg-white/5 text-white text-sm font-semibold flex items-center justify-center gap-3 hover:bg-white/10 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-sm text-slate-500 mt-5">
          Already have an account?{" "}
          <Link href="/login" className="text-primary-400 font-semibold hover:text-primary-300">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
