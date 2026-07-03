"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getUserAttempts } from "@/lib/firebase/firestore";
import { Ring, EmptyState, Spinner } from "@/components/ui";
import { scoreColor } from "@/lib/utils/formatters";
import type { AttemptDoc } from "@/types";

export default function AnalyticsPage() {
  const { profile } = useAuth();
  const [attempts, setAttempts] = useState<AttemptDoc[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (!profile) return;
    getUserAttempts(profile.uid).then((a) => { setAttempts(a); setLoading(false); });
  }, [profile]);

  if (loading) return <div className="flex justify-center py-20"><Spinner size={40} /></div>;
  if (!attempts.length) return <EmptyState icon="📊" title="No data yet" desc="Complete some exams and your analytics will appear here" />;

  const totalQ   = attempts.reduce((s, a) => s + a.totalQuestions, 0);
  const totalC   = attempts.reduce((s, a) => s + a.correctCount, 0);
  const accuracy = totalQ > 0 ? Math.round((totalC / totalQ) * 100) : 0;
  const avgScore = Math.round(attempts.reduce((s, a) => s + a.score, 0) / attempts.length);

  // Weekly activity (last 7 days)
  const now  = new Date();
  const week = Array.from({ length: 7 }, (_, i) => {
    const d   = new Date(now); d.setDate(d.getDate() - (6 - i));
    const ds  = d.toISOString().split("T")[0];
    const day = attempts.filter((a) => {
      const t = (a.completedAt as any)?.toDate?.() ?? new Date();
      return t.toISOString().startsWith(ds);
    });
    return {
      label:   ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()],
      correct: day.reduce((s, a) => s + a.correctCount, 0),
      wrong:   day.reduce((s, a) => s + a.wrongCount, 0),
    };
  });
  const maxBar = Math.max(...week.map((d) => d.correct + d.wrong), 1);

  // Per-chapter accuracy
  const chMap: Record<string, { c: number; t: number }> = {};
  attempts.forEach((att) => {
    (att.chapterIds ?? []).forEach((id) => {
      if (!chMap[id]) chMap[id] = { c: 0, t: 0 };
      chMap[id].t += att.totalQuestions;
      chMap[id].c += att.correctCount;
    });
  });
  const chData = Object.entries(chMap)
    .map(([id, d]) => ({ id, acc: Math.round((d.c / d.t) * 100), total: d.t }))
    .sort((a, b) => a.acc - b.acc);

  const kpis = [
    { label: "Accuracy",   value: `${accuracy}%`, ring: accuracy,  color: "#2FA084" },
    { label: "Avg Score",  value: `${avgScore}%`, ring: avgScore,  color: "#8B5CF6" },
    { label: "Questions",  value: totalQ,          ring: Math.min(100, Math.round(totalQ / 20)), color: "#3B82F6" },
    { label: "Exams",      value: attempts.length, ring: Math.min(100, attempts.length * 5),     color: "#F59E0B" },
  ];

  return (
    <div className="space-y-6">
      {/* KPI rings */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="bg-navy-card rounded-2xl p-5 border border-white/8 flex flex-col items-center gap-2">
            <div className="relative">
              <Ring value={k.ring} size={68} stroke={6} color={k.color} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-extrabold" style={{ color: k.color }}>{k.value}</span>
              </div>
            </div>
            <span className="text-xs text-slate-400">{k.label}</span>
          </div>
        ))}
      </div>

      {/* Weekly activity */}
      <div className="bg-navy-card rounded-2xl p-6 border border-white/8">
        <h3 className="font-bold text-white text-[15px] mb-5">Weekly Activity</h3>
        <div className="flex items-end gap-2 h-28">
          {week.map((d, i) => {
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

      {/* Chapter accuracy */}
      {chData.length > 0 && (
        <div className="bg-navy-card rounded-2xl p-6 border border-white/8">
          <h3 className="font-bold text-white text-[15px] mb-5">Accuracy by Chapter</h3>
          <div className="space-y-4">
            {chData.map((ch) => {
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
        </div>
      )}
    </div>
  );
}
