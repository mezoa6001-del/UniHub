"use client";

interface ChapterAccuracy { id: string; acc: number; total: number; }

export function ChapterAccuracyBars({ data }: { data: ChapterAccuracy[] }) {
  return (
    <div className="space-y-4">
      {data.map((ch) => {
        const col = ch.acc >= 80 ? "#2FA084" : ch.acc >= 60 ? "#F59E0B" : "#EF4444";
        return (
          <div key={ch.id}>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-white font-medium">{ch.id} <span className="text-slate-500 text-xs">({ch.total} Q)</span></span>
              <span className="font-bold" style={{ color: col }}>{ch.acc}%</span>
            </div>
            <div className="h-2 bg-white/8 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${ch.acc}%`, background: col }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
