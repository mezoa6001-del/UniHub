"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getChapters, getUserAttempts } from "@/lib/firebase/firestore";
import { scoreColor, tsToDate } from "@/lib/utils/formatters";
import type { ChapterDoc, AttemptDoc } from "@/types";

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-navy-card rounded-2xl p-5 border border-white/8">
      <div className="text-3xl mb-3">{icon}</div>
      <div className="text-2xl font-extrabold" style={{ color }}>{value}</div>
      <div className="text-xs text-slate-400 mt-1">{label}</div>
    </div>
  );
}

function RingProgress({ value, size = 52, color = "#2FA084" }: { value: number; size?: number; color?: string }) {
  const r = (size - 5) / 2, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={5} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeDasharray={c} strokeDashoffset={c - (value / 100) * c}
        strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.7s ease" }} />
    </svg>
  );
}

export default function DashboardPage() {
  const { profile, sub } = useAuth();
  const [chapters,  setChapters]  = useState<ChapterDoc[]>([]);
  const [attempts,  setAttempts]  = useState<AttemptDoc[]>([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
  if (!profile) {
    setLoading(false);
    return;
  }

  Promise.all([
    getChapters(),
    getUserAttempts(profile.uid),
  ])
    .then(([ch, att]) => {
      setChapters(ch);
      setAttempts(att);
    })
    .finally(() => setLoading(false));
}, [profile]);

  const accuracy = profile && profile.questionsAnswered > 0
    ? Math.round((profile.correctAnswers / profile.questionsAnswered) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative bg-gradient-to-r from-navy to-navy-light rounded-2xl p-7 overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-primary-500/10 rounded-full -translate-y-1/4 translate-x-1/4 blur-2xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-400/25 bg-primary-500/10 px-3 py-1 mb-4">
            <span className="w-5 h-5 rounded-md bg-gradient-to-br from-primary-500 to-secondary flex items-center justify-center text-[11px] font-black text-white">U</span>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary-300">UniHub</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">
            Welcome back, {profile?.displayName?.split(" ")[0] ?? "Doctor"} 👋
          </h1>
          <p className="text-slate-400 text-sm mb-5">
            {sub?.isActive
              ? `Subscription active · expires ${tsToDate(sub.expiresAt as any)?.toLocaleDateString()}`
              : "⚠️ No active subscription — upgrade to unlock all content"}
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/qbank"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-secondary text-white font-bold text-sm hover:opacity-90 transition-opacity">
              🎯 Quick Exam (10 Qs)
            </Link>
            <Link href="/qbank"
              className="px-5 py-2.5 rounded-xl border border-white/15 text-white font-semibold text-sm hover:bg-white/5 transition-colors">
              📋 Build Custom Exam
            </Link>
          </div>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon="⭐" label="Accuracy"     value={`${accuracy}%`}                               color="#2FA084" />
        <StatCard icon="✅" label="Solved"        value={(profile?.questionsAnswered ?? 0).toLocaleString()} color="#3B82F6" />
        <StatCard icon="📋" label="Exams Taken"  value={attempts.length}                              color="#8B5CF6" />
        <StatCard icon="🏅" label="Total Score"  value={(profile?.totalScore ?? 0).toLocaleString()}  color="#F59E0B" />
      </div>

      {/* Quick nav cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { href:"/qbank",       icon:"📝", title:"Question Bank",  desc:"3 exam modes", color:"#2FA084"  },
          { href:"/flashcards",  icon:"⚡", title:"Flashcards",     desc:"Spaced repetition", color:"#8B5CF6" },
          { href:"/videos",      icon:"🎥", title:"Video Lectures", desc:"Expert-led",   color:"#EF4444"  },
          { href:"/leaderboard", icon:"🏆", title:"Leaderboard",    desc:"Weekly rankings", color:"#F59E0B" },
        ].map((card) => (
          <Link key={card.href} href={card.href}
            className="bg-navy-card rounded-2xl p-5 border border-white/8 hover:-translate-y-1 transition-transform cursor-pointer block">
            <div className="text-3xl mb-3">{card.icon}</div>
            <div className="font-bold text-white text-sm mb-1">{card.title}</div>
            <div className="text-xs font-semibold" style={{ color: card.color }}>{card.desc}</div>
          </Link>
        ))}
      </div>

      {/* Chapters */}
      <div className="bg-navy-card rounded-2xl p-6 border border-white/8">
        <h3 className="font-bold text-white text-[15px] mb-5">
          Chapters {loading ? "" : `(${chapters.length})`}
        </h3>
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i=><div key={i} className="h-10 skeleton rounded-lg"/>)}
          </div>
        ) : chapters.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p className="text-4xl mb-2">📚</p>
            <p>No chapters yet — add them in Admin</p>
          </div>
        ) : (
          <div className="space-y-4">
            {chapters.map((ch) => (
              <div key={ch.id}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm text-white font-medium">{ch.icon} {ch.name}</span>
                  <span className="text-xs text-slate-400">{ch.questionCount ?? 0} Qs</span>
                </div>
                <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <div className="h-full rounded-full w-2/5" style={{ background: ch.color ?? "#2FA084" }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent attempts */}
      {attempts.length > 0 && (
        <div className="bg-navy-card rounded-2xl p-6 border border-white/8">
          <h3 className="font-bold text-white text-[15px] mb-5">Recent Exams</h3>
          <div className="space-y-3">
            {attempts.slice(0, 5).map((att) => {
              const sc  = att.score ?? 0;
              const col = scoreColor(sc);
              return (
                <div key={att.id} className="flex items-center gap-4 py-2 border-b border-white/5 last:border-0">
                  <div className="relative shrink-0 w-11 h-11">
                    <RingProgress value={sc} size={44} color={col} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[10px] font-extrabold" style={{ color: col }}>{sc}%</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white capitalize">{att.mode} Exam</p>
                    <p className="text-xs text-slate-400">{att.correctCount}/{att.totalQuestions} correct</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-lg font-bold" style={{ background: col + "20", color: col }}>
                    {sc}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
