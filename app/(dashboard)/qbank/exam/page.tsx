"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useExamStore } from "@/store/examStore";
import { saveAttempt, recordWrongQuestion, addBookmark, removeBookmark, getUserBookmarks } from "@/lib/firebase/firestore";
import { Badge, Ring } from "@/components/ui";
import { formatTime, difficultyColor, scoreColor } from "@/lib/utils/formatters";
import type { AttemptAnswer } from "@/types";

export default function ExamPage() {
  const router   = useRouter();
  const { profile } = useAuth();
  const { session, submitAnswer, nextQuestion, prevQuestion, finishSession, clearSession } = useExamStore();

  const [elapsed,   setElapsed]   = useState(0);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [saving,    setSaving]    = useState(false);
  const [showResult,setResult]    = useState(false);

  // Redirect if no session
  useEffect(() => { if (!session) router.replace("/qbank"); }, [session, router]);

  // Timer
  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Load bookmarks
  useEffect(() => {
    if (!profile) return;
    getUserBookmarks(profile.uid).then((bms) => setBookmarks(new Set(bms.map((b) => b.questionId))));
  }, [profile]);

  const finish = useCallback(async () => {
    if (!profile || !session) return;
    setSaving(true);
    try {
      const total   = session.questions.length;
      const correct = Object.values(session.answers).filter((a) => a.correct).length;
      const wrong   = total - correct;
      const score   = Math.round((correct / total) * 100);
      await saveAttempt(profile.uid, {
        mode: session.mode, chapterIds: [...new Set(session.questions.map((q) => q.chapterId))],
        questionIds: session.questions.map((q) => q.id), answers: session.answers,
        totalQuestions: total, correctCount: correct, wrongCount: wrong,
        score, timeTaken: elapsed, completed: true, startedAt: session.startedAt,
      }, profile.displayName);
      finishSession();
      setResult(true);
    } finally { setSaving(false); }
  }, [profile, session, elapsed, finishSession]);

  if (!session) return null;

  const q         = session.questions[session.currentIndex];
  const answered  = session.answers[q?.id];
  const pct       = ((session.currentIndex + 1) / session.questions.length) * 100;

  // Show results screen
  if (showResult) {
    const total   = session.questions.length;
    const correct = Object.values(session.answers).filter((a) => a.correct).length;
    const score   = Math.round((correct / total) * 100);
    const col     = scoreColor(score);
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center">
        <div className="bg-navy-card rounded-2xl p-8 border border-white/8">
          <div className="relative inline-block mb-4">
            <Ring value={score} size={100} stroke={8} color={col} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-extrabold" style={{ color: col }}>{score}%</span>
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-white mb-2">Exam Complete!</h2>
          <p className="text-slate-400 mb-6">{correct}/{total} correct · {formatTime(elapsed)} taken</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { clearSession(); router.push("/qbank"); }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-secondary font-bold text-white text-sm">
              New Exam
            </button>
            <button onClick={() => { clearSession(); router.push("/"); }}
              className="px-6 py-3 rounded-xl border border-white/15 text-white font-semibold text-sm hover:bg-white/5">
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!q) return null;

  const selectAnswer = async (optId: string) => {
    if (answered || !profile) return;
    const correct = optId === q.correctAnswer;
    const ans: AttemptAnswer = { selected: optId, correct, timeSpent: elapsed };
    submitAnswer(q.id, ans);
    if (!correct) await recordWrongQuestion(profile.uid, q.id, q.chapterId);
  };

  const toggleBm = async () => {
    if (!profile) return;
    const bms = await getUserBookmarks(profile.uid);
    const ex  = bms.find((b) => b.questionId === q.id);
    if (ex) { await removeBookmark(ex.id); setBookmarks((s) => { const n = new Set(s); n.delete(q.id); return n; }); }
    else    { await addBookmark(profile.uid, q.id); setBookmarks((s) => new Set([...s, q.id])); }
  };

  return (
    <div className="min-h-screen bg-[#0A1628]">
      {/* Header */}
      <div className="bg-navy px-5 py-3 flex items-center gap-4 border-b border-white/6">
        <button onClick={finish} className="bg-white/10 border-none rounded-lg px-4 py-2 text-white text-sm font-semibold hover:bg-white/15">
          ✕ End
        </button>
        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary-500 to-secondary rounded-full transition-all" style={{ width: `${pct}%` }}/>
        </div>
        <span className="text-slate-400 text-sm font-semibold whitespace-nowrap">
          {session.currentIndex + 1}/{session.questions.length}
        </span>
        <span className="bg-secondary/10 text-secondary text-sm font-bold px-3 py-1 rounded-lg">
          ⏱ {formatTime(elapsed)}
        </span>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-6 space-y-4">
        {/* Question card */}
        <div className="bg-navy-card rounded-2xl p-7 border border-white/8">
          <div className="flex justify-between items-start mb-4 gap-3">
            <div className="flex gap-2 flex-wrap">
              {q.chapterName && <Badge color="#3B82F6">{q.chapterName}</Badge>}
              {q.difficulty  && <Badge color={difficultyColor(q.difficulty)}>{q.difficulty}</Badge>}
            </div>
            <button onClick={toggleBm}
              className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all"
              style={{
                background:  bookmarks.has(q.id) ? "#2FA084" : "transparent",
                borderColor: bookmarks.has(q.id) ? "#2FA084" : "rgba(255,255,255,0.15)",
                color:       bookmarks.has(q.id) ? "#fff" : "#7A99BB",
              }}>
              {bookmarks.has(q.id) ? "🔖 Saved" : "🔖 Save"}
            </button>
          </div>
          <p className="text-[15px] leading-relaxed text-white font-medium">{q.text}</p>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {(q.options ?? []).map((opt) => {
            let bg = "transparent", border = "rgba(255,255,255,0.08)", color = "white";
            if (answered) {
              if (opt.id === q.correctAnswer)                                           { bg = "#2FA08418"; border = "#2FA084"; color = "#2FA084"; }
              else if (opt.id === answered.selected && answered.selected !== q.correctAnswer) { bg = "#EF444418"; border = "#EF4444"; color = "#EF4444"; }
            }
            return (
              <button key={opt.id} onClick={() => selectAnswer(opt.id)}
                className="w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all"
                style={{ background: bg, borderColor: border, cursor: answered ? "default" : "pointer" }}>
                <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-extrabold border-2"
                  style={{ borderColor: border, background: answered ? border + "25" : "rgba(255,255,255,0.06)", color }}>
                  {opt.id.toUpperCase()}
                </div>
                <span className="text-[14px]" style={{ color, flex: 1 }}>{opt.text}</span>
                {answered && opt.id === q.correctAnswer && <span>✅</span>}
                {answered && opt.id === answered.selected && answered.selected !== q.correctAnswer && <span>❌</span>}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {answered && q.explanation && (
          <div className="bg-navy-card rounded-2xl p-6 border border-white/8 animate-fade-up">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                style={{ background: answered.correct ? "#2FA08420" : "#EF444420" }}>
                {answered.correct ? "✅" : "❌"}
              </div>
              <span className="font-bold text-[15px]" style={{ color: answered.correct ? "#2FA084" : "#EF4444" }}>
                {answered.correct ? "Correct!" : "Incorrect — see explanation below"}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">{q.explanation}</p>
            {q.references?.length > 0 && (
              <div className="mt-4 p-3 bg-white/3 rounded-xl">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">References</p>
                {q.references.map((r, i) => (
                  <p key={i} className="text-xs text-blue-400">📖 {r}</p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Nav */}
        <div className="flex justify-between pt-2">
          <button onClick={() => prevQuestion()}
            disabled={session.currentIndex === 0}
            className="px-6 py-2.5 rounded-xl border border-white/12 text-slate-400 font-bold text-sm disabled:opacity-30 hover:bg-white/5">
            ← Previous
          </button>
          {session.currentIndex < session.questions.length - 1 ? (
            <button onClick={() => nextQuestion()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-secondary text-white font-bold text-sm">
              Next →
            </button>
          ) : (
            <button onClick={finish} disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-secondary text-white font-bold text-sm disabled:opacity-60">
              {saving ? "Saving…" : "Finish Exam 🎉"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
