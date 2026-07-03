"use client";
import { useEffect, useState } from "react";
import { getChapters, getQuestions, createQuestion, updateQuestion, softDeleteQuestion } from "@/lib/firebase/firestore";
import { Badge, EmptyState, Spinner, PrimaryBtn, Toast } from "@/components/ui";
import { difficultyColor } from "@/lib/utils/formatters";
import type { ChapterDoc, QuestionDoc } from "@/types";

const BLANK_Q = {
  chapterId: "", chapterName: "", text: "", explanation: "", difficulty: "medium" as const,
  options: [{ id: "a", text: "" }, { id: "b", text: "" }, { id: "c", text: "" }, { id: "d", text: "" }],
  correctAnswer: "a", references: [] as string[], tags: [] as string[],
};

export default function AdminQuestionsPage() {
  const [chapters,  setChapters]  = useState<ChapterDoc[]>([]);
  const [questions, setQuestions] = useState<QuestionDoc[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [modal,     setModal]     = useState<{ mode: "add"|"edit"; data: any } | null>(null);
  const [toast,     setToast]     = useState<{ msg: string; type: "success"|"error" } | null>(null);

  const load = async () => {
    setLoading(true);
    const [ch, qs] = await Promise.all([getChapters(), getQuestions()]);
    setChapters(ch); setQuestions(qs); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const del = async (q: QuestionDoc) => {
    if (!confirm(`Delete "${q.text.substring(0,50)}…"?`)) return;
    await softDeleteQuestion(q.id, q.chapterId);
    setToast({ msg: "Question deleted", type: "success" });
    load();
  };

  const save = async (form: any) => {
    const chapter = chapters.find((c) => c.id === form.chapterId);
    const payload = { ...form, chapterName: chapter?.name ?? form.chapterId };
    if (modal?.mode === "add") await createQuestion(payload);
    else await updateQuestion(modal!.data.id, payload);
    setToast({ msg: modal?.mode === "add" ? "Question created" : "Question updated", type: "success" });
    setModal(null);
    load();
  };

  return (
    <div className="space-y-5">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex justify-end">
        <PrimaryBtn onClick={() => setModal({ mode: "add", data: { ...BLANK_Q } })}>+ Add Question</PrimaryBtn>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={40} /></div>
      ) : questions.length === 0 ? (
        <EmptyState icon="📝" title="No questions yet" desc="Click + Add Question to create the first one" />
      ) : (
        <div className="bg-navy-card rounded-2xl border border-white/8 overflow-hidden">
          {questions.map((q) => (
            <div key={q.id} className="flex items-center gap-4 px-5 py-4 border-b border-white/5 last:border-0">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white mb-2 line-clamp-1">{q.text}</p>
                <div className="flex gap-2 items-center flex-wrap">
                  <Badge color="#3B82F6">{q.chapterName}</Badge>
                  <Badge color={difficultyColor(q.difficulty)}>{q.difficulty}</Badge>
                  <span className="text-xs text-slate-500">Used {q.usageCount ?? 0}×</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setModal({ mode: "edit", data: q })}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg text-blue-400 border border-blue-500/30 hover:bg-blue-500/10">Edit</button>
                <button onClick={() => del(q)}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg text-red-400 border border-red-500/30 hover:bg-red-500/10">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && <QuestionModal mode={modal.mode} initial={modal.data} chapters={chapters} onClose={() => setModal(null)} onSave={save} />}
    </div>
  );
}

function QuestionModal({ mode, initial, chapters, onClose, onSave }: any) {
  const [form, setForm] = useState(initial);
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  const setOpt = (i: number, v: string) => setForm((f: any) => {
    const opts = [...f.options]; opts[i] = { ...opts[i], text: v }; return { ...f, options: opts };
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/65 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-navy-card rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-white/8">
        <div className="px-6 py-4 border-b border-white/8 flex justify-between items-center">
          <h3 className="font-bold text-white">{mode === "add" ? "Add Question" : "Edit Question"}</h3>
          <button onClick={onClose} className="text-slate-400 text-xl hover:text-white">×</button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Chapter</label>
            <select value={form.chapterId} onChange={(e) => set("chapterId", e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/8 text-white text-sm outline-none">
              <option value="">Select chapter</option>
              {chapters.map((c: ChapterDoc) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Question Text</label>
            <textarea value={form.text} onChange={(e) => set("text", e.target.value)} rows={4}
              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/8 text-white text-sm outline-none resize-y" />
          </div>
          {form.options.map((opt: any, i: number) => (
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
            <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/12 text-slate-400 font-semibold text-sm">Cancel</button>
            <button onClick={() => onSave(form)} className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-primary-500 to-secondary text-white font-bold text-sm">
              {mode === "add" ? "Create Question" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
