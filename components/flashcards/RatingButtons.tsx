"use client";

interface Props {
  onRate: (difficulty: "easy" | "medium" | "hard") => void;
}

const OPTIONS = [
  { d: "hard",   emoji: "😓", color: "#EF4444" },
  { d: "medium", emoji: "🤔", color: "#F59E0B" },
  { d: "easy",   emoji: "😊", color: "#2FA084" },
] as const;

export function RatingButtons({ onRate }: Props) {
  return (
    <div className="flex gap-3">
      {OPTIONS.map(({ d, emoji, color }) => (
        <button key={d} onClick={() => onRate(d)}
          className="flex-1 py-3.5 rounded-2xl font-bold text-sm transition-all hover:opacity-80"
          style={{ background: color + "18", border: `2px solid ${color}30`, color }}>
          {emoji} {d.charAt(0).toUpperCase() + d.slice(1)}
        </button>
      ))}
    </div>
  );
}
