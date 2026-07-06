"use client";

import { useEffect, useState } from "react";
import {
  getChapters,
  createChapter,
  updateChapter,
  deleteChapter,
} from "@/lib/firebase/firestore";
import {
  EmptyState,
  Spinner,
  PrimaryBtn,
  Toast,
} from "@/components/ui";
import type { ChapterDoc } from "@/types";

const BLANK = {
  name: "",
  icon: "📖",
  color: "#2FA084",
  description: "",
  order: 1,
};

export default function AdminChaptersPage() {
  const [chapters, setChapters] = useState<ChapterDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [modal, setModal] = useState<{
    mode: "add" | "edit";
    data: any;
  } | null>(null);

  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  async function load() {
    setLoading(true);
    const data = await getChapters();
    setChapters(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = chapters.filter((chapter) =>
    chapter.name.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;

    await deleteChapter(id);

    setToast({
      msg: "Chapter deleted",
      type: "success",
    });

    load();
  }

  async function handleSave(form: any) {
    if (modal?.mode === "add") {
      await createChapter(form);
    } else {
      await updateChapter(modal!.data.id, form);
    }

    setToast({
      msg:
        modal?.mode === "add"
          ? "Chapter created"
          : "Chapter updated",
      type: "success",
    });

    setModal(null);

    load();
  }

  return (
    <div className="space-y-5">

      {toast && (
        <Toast
          msg={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

        <input
          type="text"
          placeholder="🔍 Search chapters..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 outline-none focus:border-primary-500"
        />

        <PrimaryBtn
          onClick={() =>
            setModal({
              mode: "add",
              data: { ...BLANK },
            })
          }
        >
          + Add Chapter
        </PrimaryBtn>

      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size={40} />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="📚"
          title="No chapters"
          desc="Create your first chapter"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {filtered.map((chapter) => (
            <div
              key={chapter.id}
              className="bg-navy-card rounded-2xl p-5 border border-white/8"
            >
              <div className="text-4xl mb-3">
                {chapter.icon}
              </div>

              <h3 className="font-bold text-white text-sm mb-1">
                {chapter.name}
              </h3>

              <p className="text-xs text-slate-400 mb-4">
                {chapter.questionCount ?? 0} Qs ·
                {" "}
                {chapter.flashcardCount ?? 0} FCs ·
                {" "}
                {chapter.videoCount ?? 0} vids
              </p>

              <div className="h-1 bg-white/8 rounded-full mb-4">
                <div
                  className="h-full rounded-full w-2/5"
                  style={{
                    background: chapter.color,
                  }}
                />
              </div>

              <div className="flex gap-2">

                <button
                  onClick={() =>
                    setModal({
                      mode: "edit",
                      data: chapter,
                    })
                  }
                  className="flex-1 py-2 rounded-lg text-xs font-bold text-blue-400 border border-blue-500/30"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(chapter.id, chapter.name)
                  }
                  className="px-3 py-2 rounded-lg text-xs font-bold text-red-400 border border-red-500/30"
                >
                  🗑
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

      {modal && (
        <ChapterModal
          mode={modal.mode}
          initial={modal.data}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

    </div>
  );
}
function ChapterModal({ mode, initial, onClose, onSave }: any) {
  const [form, setForm] = useState({
    ...BLANK,
    ...initial,
  });

  const set = (key: string, value: any) =>
    setForm((prev: any) => ({
      ...prev,
      [key]: value,
    }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-navy-card">

        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 className="text-lg font-bold text-white">
            {mode === "add" ? "Add Chapter" : "Edit Chapter"}
          </h2>

          <button
            onClick={onClose}
            className="text-xl text-slate-400 transition hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="space-y-4 p-6">

          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Chapter Name
            </label>

            <input
              value={form.name ?? ""}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Cardiovascular Pharmacology"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Icon
            </label>

            <input
              value={form.icon ?? ""}
              onChange={(e) => set("icon", e.target.value)}
              placeholder="📖"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Color
            </label>

            <input
              type="color"
              value={form.color ?? "#2FA084"}
              onChange={(e) => set("color", e.target.value)}
              className="h-12 w-full cursor-pointer rounded-lg border border-white/10 bg-white/5"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Description
            </label>

            <textarea
              value={form.description ?? ""}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Display Order
            </label>

            <input
              type="number"
              value={form.order ?? 1}
              onChange={(e) =>
                set("order", Number(e.target.value))
              }
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none"
            />
          </div>

          <div className="flex gap-3 pt-2">

            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 py-3 text-sm font-semibold text-slate-300"
            >
              Cancel
            </button>

            <button
              onClick={() => onSave(form)}
              className="flex-[2] rounded-xl bg-gradient-to-r from-primary-500 to-secondary py-3 text-sm font-bold text-white"
            >
              {mode === "add"
                ? "Create Chapter"
                : "Save Changes"}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}