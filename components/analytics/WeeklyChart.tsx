"use client";

interface DayData { label: string; correct: number; wrong: number; }

export function WeeklyChart({ data }: { data: DayData[] }) {
  const maxBar = Math.max(...data.map((d) => d.correct + d.wrong), 1);
  return (
    <div>
      <div className="flex items-end gap-2 h-28">
        {data.map((d, i) => {
          const cH = (d.correct / maxBar) * 100;
          const wH = (d.wrong   / maxBar) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col justify-end gap-0.5" style={{ height: 96 }}>
                {d.wrong   > 0 && <div style={{ height: `${wH}%`, background: "#EF4444", borderRadius: "3px 3px 0 0", opacity: 0.8 }} />}
                {d.correct > 0 && <div style={{ height: `${cH}%`, background: "#2FA084", borderRadius: "3px 3px 0 0" }} />}
              </div>
              <span className="text-[10px] text-slate-400">{d.label}</span>
            </div>
          );
        })}
      </div>
      <div className="flex gap-4 mt-3">
        {[["#2FA084","Correct"],["#EF4444","Incorrect"]].map(([c,l]) => (
          <div key={l} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} />
            <span className="text-xs text-slate-400">{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
