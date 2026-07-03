// ─── Shared UI Atoms ──────────────────────────────────────────
"use client";
import { cn } from "@/lib/utils/cn";

// Badge / Pill
export function Badge({ children, color = "#2FA084", className = "" }: {
  children: React.ReactNode; color?: string; className?: string;
}) {
  return (
    <span className={cn("inline-block whitespace-nowrap text-[11px] font-bold px-2 py-0.5 rounded-md", className)}
      style={{ background: color + "22", color, border: `1px solid ${color}44` }}>
      {children}
    </span>
  );
}

// Spinner
export function Spinner({ size = 32, color = "#2FA084" }: { size?: number; color?: string }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%",
      border: `3px solid ${color}30`, borderTopColor: color,
      animation: "spin 0.8s linear infinite" }} />
  );
}

// Progress Ring
export function Ring({ value, size = 60, stroke = 5, color = "#2FA084" }: {
  value: number; size?: number; stroke?: number; color?: string;
}) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={c} strokeDashoffset={c - (value / 100) * c}
        strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.7s ease" }}/>
    </svg>
  );
}

// Progress Bar
export function ProgressBar({ value, color = "#2FA084", height = 6 }: {
  value: number; color?: string; height?: number;
}) {
  return (
    <div className="w-full bg-white/8 rounded-full overflow-hidden" style={{ height }}>
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

// Toast
export function Toast({ msg, type, onClose }: { msg: string; type: "success"|"error"|"info"; onClose: ()=>void }) {
  const bg = type === "error" ? "#EF4444" : type === "info" ? "#3B82F6" : "#2FA084";
  return (
    <div className="fixed top-5 right-5 z-[9999] flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white shadow-2xl animate-slide-in"
      style={{ background: bg }}>
      {type === "error" ? "❌" : type === "info" ? "ℹ️" : "✅"} {msg}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 text-lg leading-none">×</button>
    </div>
  );
}

// Skeleton loader
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={cn("skeleton rounded-lg", className)} />;
}

// Stat card
export function StatCard({ icon, label, value, color }: {
  icon: string; label: string; value: string | number; color: string;
}) {
  return (
    <div className="bg-navy-card rounded-2xl p-5 border border-white/8">
      <div className="text-3xl mb-3">{icon}</div>
      <div className="text-2xl font-extrabold" style={{ color }}>{value}</div>
      <div className="text-xs text-slate-400 mt-1">{label}</div>
    </div>
  );
}

// Empty state
export function EmptyState({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="text-center py-16 px-4">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400">{desc}</p>
    </div>
  );
}

// Section card wrapper
export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("bg-navy-card rounded-2xl border border-white/8 p-6", className)}>
      {children}
    </div>
  );
}

// Primary button
export function PrimaryBtn({ children, onClick, disabled = false, className = "" }: {
  children: React.ReactNode; onClick?: ()=>void; disabled?: boolean; className?: string;
}) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={cn("px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-secondary font-bold text-white text-sm disabled:opacity-50 hover:opacity-90 transition-opacity", className)}>
      {children}
    </button>
  );
}
