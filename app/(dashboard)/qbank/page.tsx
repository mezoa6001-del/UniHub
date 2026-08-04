"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getChapters, getQuestions, getUserBookmarks, getUserWrongQuestions } from "@/lib/firebase/firestore";
import { useExamStore } from "@/store/examStore";
import type { ChapterDoc } from "@/types";

export default function QBankPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const startSession = useExamStore((s) => s.startSession);

  const [chapters,  setChapters]  = useState<ChapterDoc[]>([]);
  const [selChapters, setSelCh]   = useState<string[]>([]);
  const [numQ,      setNumQ]      = useState(20);
  const [mode,      setMode]      = useState<"standard"|"timed">("standard");
  const [filter,    setFilter]    = useState<"all"|"bookmarked"|"incorrect">("all");
  const [loading,   setLoading]   = useState(false);

  useEffect(() => {
  getChapters().then(setChapters);
}, []);

  const toggle = (id: string) =>
    setSelCh((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);

  const start = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const chId = selChapters.length === 1 ? selChapters[0] : undefined;
      let qs = await getQuestions(chId);

      if (filter === "bookmarked") {
        const bms = await getUserBookmarks(profile.uid);
        const ids = new Set(bms.map((b) => b.questionId));
        qs = qs.filter((q) => ids.has(q.id));
      } else if (filter === "incorrect") {
        const wqs = await getUserWrongQuestions(profile.uid);
        const ids = new Set(wqs.map((w) => w.questionId));
        qs = qs.filter((q) => ids.has(q.id));
      }

      if (!qs.length) {
  alert("No questions match your filters. Try adjusting your selection.");
  setLoading(false);
  return;
}

      const shuffled = [...qs].sort(() => Math.random() - 0.5);

const selected = shuffled.slice(
  0,
  Math.min(numQ, shuffled.length)
);
      startSession(selected, mode, mode === "timed");
      router.push("/qbank/exam");
    } finally { setLoading(false); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">
      <div className="space-y-5">
        {/* Chapter selector */}
        <div className="bg-navy-card rounded-2xl p-6 border border-white/8">
          <h3 className="font-bold text-white text-[15px] mb-4">
            Select Chapters {selChapters.length > 0 && <span className="text-primary-400">({selChapters.length} selected)</span>}
          </h3>
          {chapters.length === 0 ? (
            <p className="text-slate-500 text-sm">No chapters available — add them in Admin first</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {chapters.map((ch) => {
                const on = selChapters.includes(ch.id);
                return (
                  <button key={ch.id} onClick={() => toggle(ch.id)}
                    className="p-3 rounded-xl text-left transition-all border-2"
                    style={{
                      borderColor: on ? (ch.color ?? "#2FA084") : "rgba(255,255,255,0.08)",
                      background:  on ? (ch.color ?? "#2FA084") + "18" : "transparent",
                    }}>
                    <div className="text-2xl mb-1">{ch.icon}</div>
                    <div className="text-[13px] font-semibold" style={{ color: on ? (ch.color ?? "#2FA084") : "white" }}>{ch.name}</div>
                    <div className="text-[11px] text-slate-400">{ch.questionCount ?? 0} questions</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Filter */}
        <div className="bg-navy-card rounded-2xl p-6 border border-white/8">
          <h3 className="font-bold text-white text-[15px] mb-4">Question Filter</h3>
          <div className="flex gap-2 flex-wrap">
            {(["all","bookmarked","incorrect"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-4 py-2 rounded-full text-xs font-bold border transition-all capitalize"
                style={{
                  background:  filter === f ? "#2FA084" : "transparent",
                  color:       filter === f ? "#fff" : "#7A99BB",
                  borderColor: filter === f ? "#2FA084" : "rgba(255,255,255,0.1)",
                }}>
                {f === "all" ? "All Questions" : f === "bookmarked" ? "Bookmarked" : "Wrong Only"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Config */}
      <div className="bg-navy-card rounded-2xl p-6 border border-white/8 sticky top-20">
        <h3 className="font-bold text-white text-[15px] mb-5">Exam Settings</h3>

        <div className="mb-5">
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Questions</label>
          <input type="range" min="5" max="40" step="5" value={numQ}
            onChange={(e) => setNumQ(+e.target.value)} className="w-full accent-primary-500" />
          <div className="text-center text-3xl font-extrabold text-primary-400 mt-1">{numQ}</div>
        </div>

        <div className="mb-6 space-y-2">
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Mode</label>
          {(["standard","timed"] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className="w-full text-left p-3 rounded-xl border-2 transition-all"
              style={{
                borderColor: mode === m ? "#2FA084" : "rgba(255,255,255,0.08)",
                background:  mode === m ? "#2FA08418" : "transparent",
              }}>
              <div className="text-[13px] font-bold" style={{ color: mode === m ? "#2FA084" : "white" }}>
                {m === "standard" ? "Standard" : "Timed"}
              </div>
              <div className="text-[11px] text-slate-400">
                {m === "standard" ? "No time limit" : "1 minute per question"}
              </div>
            </button>
          ))}
        </div>

        <button onClick={start} disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-secondary font-bold text-white text-sm disabled:opacity-60 hover:opacity-90 transition-opacity">
          {loading ? "Loading questions…" : "Start Exam 🚀"}
        </button>
      </div>
    </div>
  );
}