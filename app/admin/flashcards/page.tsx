"use client";
import { useEffect, useState } from "react";
import { getChapters, getFlashcards, createFlashcard, updateFlashcard, deleteFlashcard } from "@/lib/firebase/firestore";
import { Badge, EmptyState, Spinner, PrimaryBtn, Toast } from "@/components/ui";
import type { ChapterDoc, FlashcardDoc } from "@/types";

export default function AdminFlashcardsPage() {
  const [fcs,   setFcs]   = useState<FlashcardDoc[]>([]);
  const [chs,   setChs]   = useState<ChapterDoc[]>([]);
  const [modal, setModal] = useState<{ mode: "add"|"edit"; data: any } | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: "success"|"error" } | null>(null);

  const load = async () => {
    setLoading(true);
    const [f, c] = await Promise.all([getFlashcards(), getChapters()]);
    setFcs(f); setChs(c); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const del = async (id: string) => {
    if (!confirm("Delete this flashcard?")) return;
    await deleteFlashcard(id);
    setToast({ msg: "Flashcard deleted", type: "success" }); load();
  };

  const save = async (form: any) => {
    if (modal?.mode === "add") await createFlashcard(form);
    else await updateFlashcard(modal!.data.id, form);
    setToast({ msg: modal?.mode === "add" ? "Created" : "Updated", type: "success" });
    setModal(null); load();
  };

  return (
    <div className="space-y-5">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex justify-end">
        <PrimaryBtn onClick={() => setModal({ mode: "add", data: { chapterId: "", front: "", back: "", order: 0 } })}>+ Add Flashcard</PrimaryBtn>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={40} /></div>
      ) : fcs.length === 0 ? (
        <EmptyState icon="⚡" title="No flashcards" desc="Create your first flashcard" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {fcs.map((fc) => (
            <div key={fc.id} className="bg-navy-card rounded-2xl p-5 border border-white/8">
              <Badge color="#2FA084">{chs.find((c) => c.id === fc.chapterId)?.title ?? fc.chapterId}</Badge>
              <p className="text-sm font-semibold text-white mt-3 mb-2 leading-relaxed">{fc.front}</p>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed whitespace-pre-line">{fc.back}</p>
              <div className="flex gap-2">
                <button onClick={() => setModal({ mode: "edit", data: fc })}
                  className="flex-1 py-2 rounded-lg text-xs font-bold text-blue-400 border border-blue-500/30">Edit</button>
                <button onClick={() => del(fc.id)}
                  className="px-3 py-2 rounded-lg text-xs font-bold text-red-400 border border-red-500/30">🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/65 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="bg-navy-card rounded-2xl w-full max-w-md border border-white/8">
            <div className="px-6 py-4 border-b border-white/8 flex justify-between items-center">
              <h3 className="font-bold text-white">{modal.mode === "add" ? "Add Flashcard" : "Edit Flashcard"}</h3>
              <button onClick={() => setModal(null)} className="text-slate-400 text-xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Chapter</label>
                <select value={modal.data.chapterId} onChange={(e) => setModal((m) => m && ({ ...m, data: { ...m.data, chapterId: e.target.value } }))}
                  className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/8 text-white text-sm outline-none">
                  <option value="">Select chapter</option>
                  {chs.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Front (Question)</label>
                <textarea value={modal.data.front} onChange={(e) => setModal((m) => m && ({ ...m, data: { ...m.data, front: e.target.value } }))} rows={3}
                  className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/8 text-white text-sm outline-none resize-y" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Back (Answer)</label>
                <textarea value={modal.data.back} onChange={(e) => setModal((m) => m && ({ ...m, data: { ...m.data, back: e.target.value } }))} rows={4}
                  className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/8 text-white text-sm outline-none resize-y" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setModal(null)} className="flex-1 py-3 rounded-xl border border-white/12 text-slate-400 font-semibold text-sm">Cancel</button>
                <button onClick={() => save(modal.data)} className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-primary-500 to-secondary text-white font-bold text-sm">
                  {modal.mode === "add" ? "Create" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
