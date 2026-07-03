"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { getChapters, createVideo, updateVideo } from "@/lib/firebase/firestore";
import { EmptyState, Spinner, PrimaryBtn, Toast } from "@/components/ui";
import { formatDuration } from "@/lib/utils/formatters";
import type { ChapterDoc, VideoDoc } from "@/types";

const BLANK = { title: "", chapterId: "", instructorName: "", duration: 0, videoUrl: "", description: "", order: 0, isPublished: false, provider: "firebase" };

export default function AdminVideosPage() {
  const [vids, setVids] = useState<VideoDoc[]>([]);
  const [chs,  setChs]  = useState<ChapterDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ mode: "add"|"edit"; data: any } | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success"|"error" } | null>(null);

  const load = async () => {
    setLoading(true);
    const [snap, c] = await Promise.all([
      getDocs(query(collection(db, "videos"), orderBy("order", "asc"), limit(100))),
      getChapters(),
    ]);
    setVids(snap.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as VideoDoc)));
    setChs(c); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async (form: any) => {
    if (modal?.mode === "add") await createVideo(form);
    else await updateVideo(modal!.data.id, form);
    setToast({ msg: modal?.mode === "add" ? "Video created" : "Video updated", type: "success" });
    setModal(null); load();
  };

  return (
    <div className="space-y-5">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex justify-end">
        <PrimaryBtn onClick={() => setModal({ mode: "add", data: { ...BLANK } })}>⬆️ Add Video</PrimaryBtn>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={40} /></div>
      ) : vids.length === 0 ? (
        <EmptyState icon="🎥" title="No videos" desc="Add your first video" />
      ) : (
        <div className="space-y-3">
          {vids.map((vid) => (
            <div key={vid.id} className="bg-navy-card rounded-2xl p-4 border border-white/8 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-navy to-navy-light flex items-center justify-center text-2xl shrink-0">🎬</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-sm mb-1">{vid.title}</p>
                <p className="text-xs text-slate-400">
                  {vid.instructorName} · {formatDuration(vid.duration)} ·{" "}
                  <span style={{ color: vid.isPublished ? "#2FA084" : "#F59E0B" }}>{vid.isPublished ? "Published" : "Draft"}</span>
                </p>
              </div>
              <button onClick={() => setModal({ mode: "edit", data: vid })}
                className="text-xs font-bold px-3 py-1.5 rounded-lg text-blue-400 border border-blue-500/30 shrink-0">Edit</button>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/65 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="bg-navy-card rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-white/8">
            <div className="px-6 py-4 border-b border-white/8 flex justify-between items-center">
              <h3 className="font-bold text-white">{modal.mode === "add" ? "Add Video" : "Edit Video"}</h3>
              <button onClick={() => setModal(null)} className="text-slate-400 text-xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              {[
                ["title", "Title", "text"], ["instructorName", "Instructor Name", "text"],
                ["duration", "Duration (seconds)", "number"], ["videoUrl", "Video URL", "text"], ["order", "Order", "number"],
              ].map(([key, label, type]) => (
                <div key={key}>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">{label}</label>
                  <input type={type} value={modal.data[key]} onChange={(e) => setModal((m) => m && ({ ...m, data: { ...m.data, [key]: type === "number" ? +e.target.value : e.target.value } }))}
                    className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/8 text-white text-sm outline-none" />
                </div>
              ))}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Chapter</label>
                <select value={modal.data.chapterId} onChange={(e) => setModal((m) => m && ({ ...m, data: { ...m.data, chapterId: e.target.value } }))}
                  className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/8 text-white text-sm outline-none">
                  <option value="">Select chapter</option>
                  {chs.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={modal.data.isPublished}
                  onChange={(e) => setModal((m) => m && ({ ...m, data: { ...m.data, isPublished: e.target.checked } }))}
                  className="w-4 h-4 accent-primary-500" />
                <span className="text-sm text-white">Published (visible to students)</span>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setModal(null)} className="flex-1 py-3 rounded-xl border border-white/12 text-slate-400 font-semibold text-sm">Cancel</button>
                <button onClick={() => save(modal.data)} className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-primary-500 to-secondary text-white font-bold text-sm">
                  {modal.mode === "add" ? "Create Video" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
