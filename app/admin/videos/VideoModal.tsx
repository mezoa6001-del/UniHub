"use client";

import { useEffect, useState } from "react";
import type { ChapterDoc, VideoDoc } from "@/types";

interface VideoModalProps {
  open: boolean;
  mode: "add" | "edit";
  initial: Partial<VideoDoc>;
  chapters: ChapterDoc[];
  onClose: () => void;
  onSave: (video: Partial<VideoDoc>) => void;
}

export default function VideoModal({
  open,
  mode,
  initial,
  chapters,
  onClose,
  onSave,
}: VideoModalProps) {
  const [form, setForm] = useState<Partial<VideoDoc>>(initial);

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  if (!open) return null;

  const setField = (key: keyof VideoDoc, value: any) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-navy-card rounded-2xl w-full max-w-xl border border-white/10 max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-bold text-white">
            {mode === "add" ? "Add Video" : "Edit Video"}
          </h2>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-4">

          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Title
            </label>

            <input
              value={form.title ?? ""}
              onChange={(e) => setField("title", e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Instructor
            </label>

            <input
              value={form.instructorName ?? ""}
              onChange={(e) =>
                setField("instructorName", e.target.value)
              }
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Chapter
            </label>

            <select
              value={form.chapterId ?? ""}
              onChange={(e) =>
                setField("chapterId", e.target.value)
              }
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white"
            >
              <option value="">Choose Chapter</option>

              {chapters.map((chapter) => (
                <option
                  key={chapter.id}
                  value={chapter.id}
                >
                  {chapter.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Bunny Video ID
            </label>

            <input
              value={form.bunnyVideoId ?? ""}
              onChange={(e) =>
                setField("bunnyVideoId", e.target.value)
              }
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Duration (seconds)
            </label>

            <input
              type="number"
              value={form.duration ?? 0}
              onChange={(e) =>
                setField("duration", Number(e.target.value))
              }
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Description
            </label>

            <textarea
              rows={4}
              value={form.description ?? ""}
              onChange={(e) =>
                setField("description", e.target.value)
              }
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white"
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isPublished ?? false}
              onChange={(e) =>
                setField("isPublished", e.target.checked)
              }
            />

            <span className="text-white">
              Published
            </span>
          </label>

          <div className="flex justify-end gap-3 pt-4">

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg border border-white/10 text-slate-300"
            >
              Cancel
            </button>

            <button
              onClick={() => onSave(form)}
              className="px-5 py-2 rounded-lg bg-primary-500 text-white font-semibold"
            >
              {mode === "add"
                ? "Create Video"
                : "Save Changes"}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}