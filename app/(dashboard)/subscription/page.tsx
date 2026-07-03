"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Toast } from "@/components/ui";
import { tsToDate } from "@/lib/utils/formatters";
import { PLANS } from "@/types";

export default function SubscriptionPage() {
  const { sub } = useAuth();
  const [sel,    setSel]    = useState("3_months");
  const [method, setMethod] = useState("card");
  const [busy,   setBusy]   = useState(false);
  const [toast,  setToast]  = useState<{ msg: string; type: "success"|"error" } | null>(null);

  const initiate = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/payment/initiate", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ planId: sel, paymentMethod: method }),
      });
      const data = await res.json();
      if (data.iframeUrl) window.open(data.iframeUrl, "_blank");
      else throw new Error(data.error ?? "Payment initiation failed");
    } catch (e: any) {
      setToast({ msg: e.message, type: "error" });
    } finally {
      setBusy(false);
    }
  };

  const selectedPlan = PLANS.find((p) => p.id === sel)!;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Current plan */}
      {sub?.isActive && (
        <div className="bg-gradient-to-r from-navy to-navy-light rounded-2xl p-6 flex justify-between items-center border border-white/8">
          <div>
            <p className="text-xs font-bold text-secondary tracking-widest uppercase mb-1">Current Plan</p>
            <p className="text-2xl font-extrabold text-white">{sub.planName ?? sub.planId?.replace(/_/g," ")}</p>
            <p className="text-sm text-slate-400 mt-1">
              Expires {tsToDate(sub.expiresAt as any)?.toLocaleDateString()}
            </p>
          </div>
          <div className="bg-primary-500/25 text-secondary font-bold text-sm px-4 py-2 rounded-full">✓ Active</div>
        </div>
      )}

      {/* Plan cards */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 text-center">Choose Your Plan</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PLANS.map((plan) => (
            <div key={plan.id} onClick={() => setSel(plan.id)}
              className="relative rounded-2xl p-5 cursor-pointer transition-all border-2"
              style={{
                borderColor: sel === plan.id ? "#2FA084" : "rgba(255,255,255,0.08)",
                background:  sel === plan.id ? "#2FA08415" : "#111E33",
                transform:   plan.popular ? "scale(1.03)" : "none",
              }}>
              {plan.popular && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-500 to-secondary text-white text-[10px] font-bold px-3 py-0.5 rounded-full whitespace-nowrap">
                  MOST POPULAR
                </div>
              )}
              {plan.save && (
                <div className="absolute top-2 right-2 bg-red-500/15 text-red-400 text-[9px] font-bold px-1.5 py-0.5 rounded">
                  Save {plan.save}
                </div>
              )}
              <div className="font-bold text-white text-sm mb-2">{plan.name}</div>
              <div className="text-2xl font-extrabold text-primary-400 mb-0.5">{plan.price}</div>
              <div className="text-[11px] text-slate-400 mb-3">{plan.currency}</div>
              {plan.features.map((f) => (
                <div key={f} className="text-[11px] text-slate-400 mb-1 flex gap-1">
                  <span className="text-primary-400 shrink-0">✓</span>{f}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Payment method */}
      <div className="bg-navy-card rounded-2xl p-6 border border-white/8 space-y-5">
        <h3 className="font-bold text-white text-[15px]">Payment Method</h3>
        <div className="flex gap-2 flex-wrap">
          {[["card","💳 Card"],["vodafone","📱 Vodafone Cash"],["instapay","⚡ InstaPay"]].map(([v,l]) => (
            <button key={v} onClick={() => setMethod(v)}
              className="px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all"
              style={{
                borderColor: method === v ? "#2FA084" : "rgba(255,255,255,0.08)",
                background:  method === v ? "#2FA08418" : "transparent",
                color:       method === v ? "#2FA084" : "#7A99BB",
              }}>{l}</button>
          ))}
        </div>

        <div className="bg-white/3 rounded-xl px-5 py-3 flex justify-between items-center">
          <span className="text-sm text-slate-400">{selectedPlan.name} Plan</span>
          <span className="text-lg font-extrabold text-primary-400">{selectedPlan.price} {selectedPlan.currency}</span>
        </div>

        <button onClick={initiate} disabled={busy}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-secondary font-bold text-white text-sm disabled:opacity-60 hover:opacity-90 transition-opacity">
          {busy ? "Processing…" : "🔒 Subscribe Now via Paymob"}
        </button>
        <p className="text-center text-xs text-slate-500">
          Powered by Paymob · SSL Encrypted · Cancel anytime
        </p>
      </div>
    </div>
  );
}
