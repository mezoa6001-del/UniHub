"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  getChapters, getFlashcards, getUserFlashcardProgress,
  saveFlashcardProgress, sm2Next,
} from "@/lib/firebase/firestore";
import { Badge, EmptyState, Spinner } from "@/components/ui";
import type { ChapterDoc, FlashcardDoc, FlashcardProgressDoc } from "@/types";

export default function FlashcardsPage() {
  const { profile } = useAuth();
  const [chapters,  setChapters]  = useState<ChapterDoc[]>([]);
  const [cards,     setCards]     = useState<FlashcardDoc[]>([]);
  const [progress,  setProgress]  = useState<Record<string, FlashcardProgressDoc>>({});
  const [selCh,     setSelCh]     = useState("all");
  const [idx,       setIdx]       = useState(0);
  const [flipped,   setFlipped]   = useState(false);
  const [view,      setView]      = useState<"study"|"browse">("study");
  const [loading,   setLoading]   = useState(true);

  useEffect(() => { getChapters().then(setChapters); }, []);

  useEffect(() => {
    if (!profile) return;
    setLoading(true);
    Promise.all([
      getFlashcards(selCh === "all" ? undefined : selCh),
      getUserFlashcardProgress(profile.uid),
    ]).then(([fc, prog]) => {
      setCards(fc); setProgress(prog); setIdx(0); setFlipped(false);
    }).finally(() => setLoading(false));
  }, [selCh, profile]);

  const rate = async (difficulty: "easy" | "medium" | "hard") => {
    if (!profile || !cards[idx]) return;
    const card = cards[idx];
    const next = sm2Next(progress[card.id] ?? {}, difficulty);
    await saveFlashcardProgress(profile.uid, card.id, next);
    setProgress((p) => ({ ...p, [card.id]: { ...p[card.id], ...next } as FlashcardProgressDoc }));
    setFlipped(false);
    setTimeout(() => setIdx((i) => (i + 1) % cards.length), 280);
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size={40} /></div>;

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center">
        {(["study", "browse"] as const).map((v) => (
          <button key={v} onClick={() => setView(v)}
            className="px-4 py-2 rounded-xl text-sm font-bold border transition-all capitalize"
            style={{
              background: view === v ? "#2FA084" : "#111E33",
              color: view === v ? "#fff" : "#7A99BB",
              borderColor: view === v ? "#2FA084" : "rgba(255,255,255,0.08)",
            }}>
            {v === "study" ? "Study Mode" : "Browse All"}
          </button>
        ))}
        <select value={selCh} onChange={(e) => setSelCh(e.target.value)}
          className="px-4 py-2 rounded-xl bg-navy-card border border-white/8 text-white text-sm outline-none">
          <option value="all">All Chapters</option>
          {chapters.map((ch) => <option key={ch.id} value={ch.id}>{ch.name}</option>)}
        </select>
        <span className="ml-auto text-sm text-slate-400">
          {cards.length} cards · {Object.keys(progress).length} reviewed
        </span>
      </div>

      {cards.length === 0
        ? <EmptyState icon="⚡" title="No flashcards" desc="Add flashcards via Admin → Flashcards" />
        : view === "study" ? (
          <div className="max-w-xl mx-auto space-y-5">
            <div className="flex justify-between text-sm text-slate-400">
              <span>{idx + 1} / {cards.length}</span>
              <span className="text-primary-400 font-semibold">
                {Math.round((Object.keys(progress).length / cards.length) * 100)}% reviewed
              </span>
            </div>

            {/* Flip card */}
            <div className="perspective-1000 cursor-pointer h-72" onClick={() => setFlipped((f) => !f)}>
              <div className={`relative h-full transition-transform duration-500 transform-style-3d ${flipped ? "rotate-y-180" : ""}`}
                style={{ transformStyle: "preserve-3d", transition: "transform 0.5s", transform: flipped ? "rotateY(180deg)" : "none" }}>
                {/* Front */}
                <div className="absolute inset-0 rounded-2xl p-8 flex flex-col items-center justify-center backface-hidden"
                  style={{ background: "linear-gradient(135deg,#0F1B2D,#1A3A5C)", border: "1px solid rgba(255,255,255,0.08)", backfaceVisibility: "hidden" }}>
                  <p className="text-[10px] font-bold text-secondary tracking-[2px] uppercase mb-4">QUESTION · tap to reveal</p>
                  <p className="text-lg text-white text-center leading-relaxed font-medium">{cards[idx]?.front}</p>
                </div>
                {/* Back */}
                <div className="absolute inset-0 rounded-2xl p-8 flex flex-col items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#0d2b1e,#1a4d2e)", border: "1px solid rgba(47,160,132,0.3)", backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                  <p className="text-[10px] font-bold text-secondary tracking-[2px] uppercase mb-4">ANSWER</p>
                  <p className="text-[15px] text-white text-center leading-relaxed whitespace-pre-line">{cards[idx]?.back}</p>
                </div>
              </div>
            </div>

            {flipped ? (
              <div className="flex gap-3">
                {([["hard", "😓", "#EF4444"], ["medium", "🤔", "#F59E0B"], ["easy", "😊", "#2FA084"]] as const).map(([d, em, col]) => (
                  <button key={d} onClick={() => rate(d as "easy" | "medium" | "hard")}
                    className="flex-1 py-3.5 rounded-2xl font-bold text-sm transition-all"
                    style={{ background: col + "18", border: `2px solid ${col}30`, color: col }}>
                    {em} {d.charAt(0).toUpperCase() + d.slice(1)}
                  </button>
                ))}
              </div>
            ) : (
              <button onClick={() => setFlipped(true)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-secondary font-bold text-white text-sm">
                Reveal Answer
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((fc) => {
              const p = progress[fc.id];
              const col = !p ? "#7A99BB" : p.difficulty === "easy" ? "#2FA084" : p.difficulty === "medium" ? "#F59E0B" : "#EF4444";
              return (
                <div key={fc.id} className="bg-navy-card rounded-2xl p-5 border border-white/8">
                  <div className="flex justify-between items-start mb-3">
                    <Badge color="#2FA084">{chapters.find((c) => c.id === fc.chapterId)?.name ?? fc.chapterId}</Badge>
                    {p && <Badge color={col}>{p.difficulty}</Badge>}
                  </div>
                  <p className="text-sm font-semibold text-white mb-2 leading-relaxed">{fc.front}</p>
                  <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-line">{fc.back}</p>
                </div>
              );
            })}
          </div>
        )
      }
    </div>
  );
}
