"use client";
import { useEffect, useState } from "react";
import { getChapters, createChapter, updateChapter, deleteChapter } from "@/lib/firebase/firestore";
import { EmptyState, Spinner, PrimaryBtn, Toast } from "@/components/ui";
import type { ChapterDoc } from "@/types";

const BLANK = { name: "", icon: "📖", color: "#2FA084", description: "", order: 1 };

export default function AdminChaptersPage() {
  console.log("Chapters page rendered");
  const [chapters, setChapters] = useState<ChapterDoc[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState<{ mode: "add"|"edit"; data: any } | null>(null);
  const [toast,    setToast]    = useState<{ msg: string; type: "success"|"error" } | null>(null);
  const [search, setSearch] = useState("");
  const load = () => { setLoading(true); getChapters().then((c) => { setChapters(c); setLoading(false); }); };
  useEffect(() => { load(); }, []);
  const filteredChapters = chapters.filter((chapter) =>
  chapter.name.toLowerCase().includes(search.toLowerCase())
);

  const del = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    await deleteChapter(id);
    setToast({ msg: "Chapter deleted", type: "success" });
    load();
  };

  const save = async (form: any) => {
    if (modal?.mode === "add") await createChapter(form);
    else await updateChapter(modal!.data.id, form);
    setToast({ msg: modal?.mode === "add" ? "Chapter created" : "Chapter updated", type: "success" });
    setModal(null); load();
  };

  return (
    <div className="space-y-5">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
  <input
    type="text"
    placeholder="🔍 Search chapters..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full sm:w-80 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 outline-none focus:border-primary-500"
  />

  <PrimaryBtn
    onClick={() => setModal({ mode: "add", data: { ...BLANK } })}
  >
    + Add Chapter
  </PrimaryBtn>
</div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={40} /></div>
      ) : filteredChapters.length === 0 ? (
        <EmptyState icon="📚" title="No chapters" desc="Create your first chapter" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChapters.map((ch) => (
            <div key={ch.id} className="bg-navy-card rounded-2xl p-5 border border-white/8">
              <div className="text-4xl mb-3">{ch.icon}</div>
              <h3 className="font-bold text-white text-sm mb-1">{ch.name}</h3>
              <p className="text-xs text-slate-400 mb-4">{ch.questionCount ?? 0} Qs · {ch.flashcardCount ?? 0} FCs · {ch.videoCount ?? 0} vids</p>
              <div className="h-1 bg-white/8 rounded-full mb-4"><div className="h-full rounded-full w-2/5" style={{ background: ch.color }} /></div>
              <div className="flex gap-2">
                <button onClick={() => setModal({ mode: "edit", data: ch })}
                  className="flex-1 py-2 rounded-lg text-xs font-bold text-blue-400 border border-blue-500/30">Edit</button>
                <button onClick={() => del(ch.id, ch.name)}
                  className="px-3 py-2 rounded-lg text-xs font-bold text-red-400 border border-red-500/30">🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && <ChapterModal mode={modal.mode} initial={modal.data} onClose={() => setModal(null)} onSave={save} />}
    </div>
  );
}

function ChapterModal({ mode, initial, onClose, onSave }: any) {
  const [form, setForm] = useState(initial);
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 bg-black/65 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-navy-card rounded-2xl w-full max-w-md border border-white/8">
        <div className="px-6 py-4 border-b border-white/8 flex justify-between items-center">
          <h3 className="font-bold text-white">{mode === "add" ? "Add Chapter" : "Edit Chapter"}</h3>
          <button onClick={onClose} className="text-slate-400 text-xl hover:text-white">×</button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Chapter Name</label>
            <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Cardiovascular Pharmacology"
              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/8 text-white text-sm outline-none" />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Icon (emoji)</label>
            <input value={form.icon} onChange={(e) => set("icon", e.target.value)} placeholder="💊"
              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/8 text-white text-sm outline-none" />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Color</label>
            <input type="color" value={form.color} onChange={(e) => set("color", e.target.value)}
              className="w-full h-10 rounded-lg cursor-pointer" />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={2}
              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/8 text-white text-sm outline-none resize-y" />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Display Order</label>
            <input type="number" value={form.order} onChange={(e) => set("order", +e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/8 text-white text-sm outline-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/12 text-slate-400 font-semibold text-sm">Cancel</button>
            <button onClick={() => onSave(form)} className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-primary-500 to-secondary text-white font-bold text-sm">
              {mode === "add" ? "Create Chapter" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
