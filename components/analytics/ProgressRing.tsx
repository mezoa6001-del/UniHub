"use client";

interface Props { value: number; size?: number; stroke?: number; color?: string; label?: string; }

export function ProgressRing({ value, size = 68, stroke = 6, color = "#2FA084", label }: Props) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke}/>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
            strokeDasharray={c} strokeDashoffset={c - (value / 100) * c}
            strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.7s ease" }}/>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-extrabold" style={{ color }}>{value}%</span>
        </div>
      </div>
      {label && <span className="text-xs text-slate-400">{label}</span>}
    </div>
  );
}
