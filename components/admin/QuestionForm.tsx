"use client";
import { useState } from "react";
import type { ChapterDoc } from "@/types";

interface Props {
  initial:  any;
  chapters: ChapterDoc[];
  onSave:   (form: any) => void;
  onCancel: () => void;
}

// Standalone reusable question form (used by app/admin/questions/page.tsx's
// inline modal, extracted here for reuse in other admin contexts).
export function QuestionForm({ initial, chapters, onSave, onCancel }: Props) {
  const [form, setForm] = useState(initial);
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  const setOpt = (i: number, v: string) => setForm((f: any) => {
    const opts = [...f.options]; opts[i] = { ...opts[i], text: v }; return { ...f, options: opts };
  });

  return (
    <div className="space-y-4">
      <div>
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Chapter</label>
        <select value={form.chapterId} onChange={(e) => set("chapterId", e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/8 text-white text-sm outline-none">
          <option value="">Select chapter</option>
          {chapters.map((c) => (
  <option key={c.id} value={c.id}>
    {c.title}
  </option>
))}
        </select>
      </div>
      <div>
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Question Text</label>
        <textarea value={form.text} onChange={(e) => set("text", e.target.value)} rows={4}
          className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/8 text-white text-sm outline-none resize-y" />
      </div>
      {form.options?.map((opt: any, i: number) => (
        <div key={opt.id}>
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Option {opt.id.toUpperCase()}</label>
          <input value={opt.text} onChange={(e) => setOpt(i, e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/8 text-white text-sm outline-none" />
        </div>
      ))}
      <div>
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Correct Answer</label>
        <select value={form.correctAnswer} onChange={(e) => set("correctAnswer", e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/8 text-white text-sm outline-none">
          {["a","b","c","d"].map((o) => <option key={o} value={o}>{o.toUpperCase()}</option>)}
        </select>
      </div>
      <div>
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Explanation</label>
        <textarea value={form.explanation} onChange={(e) => set("explanation", e.target.value)} rows={3}
          className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/8 text-white text-sm outline-none resize-y" />
      </div>
      <div>
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Difficulty</label>
        <select value={form.difficulty} onChange={(e) => set("difficulty", e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/8 text-white text-sm outline-none">
          <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
        </select>
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={onCancel} className="flex-1 py-3 rounded-xl border border-white/12 text-slate-400 font-semibold text-sm">Cancel</button>
        <button onClick={() => onSave(form)} className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-primary-500 to-secondary text-white font-bold text-sm">
          Save
        </button>
      </div>
    </div>
  );
}
