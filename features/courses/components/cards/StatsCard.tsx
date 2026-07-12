"use client";

interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number;
  color?: string;
}

export function StatsCard({
  icon,
  label,
  value,
  color = "#2FA084",
}: StatsCardProps) {
  return (
    <div className="rounded-2xl border border-white/8 bg-navy-card p-6 transition-all hover:border-white/20 hover:-translate-y-1">
      <div className="text-3xl">{icon}</div>

      <h3
        className="mt-4 text-4xl font-extrabold"
        style={{ color }}
      >
        {value}
      </h3>

      <p className="mt-2 text-sm text-slate-400">
        {label}
      </p>
    </div>
  );
}