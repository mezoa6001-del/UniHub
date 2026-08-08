"use client";
import { useEffect, useState } from "react";
import { getChaptersByCourse } from "@/lib/firebase/firestore";
import type { ChapterDoc } from "@/types";
import { useCreateVideo } from "@/features/videos/hooks/useCreateVideo";
type AddVideoModalProps = {
  open: boolean;
  onClose: () => void;
  courseId: string;
};

export default function AddVideoModal({
  open,
  onClose,
  courseId,
}: AddVideoModalProps) {

  const [chapters, setChapters] = useState<ChapterDoc[]>([]);
  const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [chapterId, setChapterId] = useState("");
const [videoUrl, setVideoUrl] = useState("");
const [duration, setDuration] = useState(0);
const [order, setOrder] = useState(1);
const [status, setStatus] = useState<"draft" | "published">("draft");
const { submit, isLoading, error } = useCreateVideo(/* هنكملها بعد شوية */);
  useEffect(() => {
    async function loadChapters() {
      const data = await getChaptersByCourse(courseId);
      setChapters(data);
    }

    if (open) {
      loadChapters();
    }
  }, [courseId, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-navy-card p-8">

        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-white">
            Add Video
          </h2>

          <p className="mt-2 text-slate-400">
            Create a new lesson for this course.
          </p>
        </div>

        {/* Form */}
        <div className="mt-8 space-y-5">

          {/* Title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Video Title
            </label>

            <input
              type="text"
              placeholder="Introduction to Diuretics"
              className="w-full rounded-xl border border-white/10 bg-[#13243A] px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-primary-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Description
            </label>

            <textarea
              rows={4}
              placeholder="Short lesson description..."
              className="w-full rounded-xl border border-white/10 bg-[#13243A] px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-primary-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Chapter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Chapter
            </label>

            <select
              className="w-full rounded-xl border border-white/10 bg-[#13243A] px-4 py-3 text-white outline-none transition focus:border-primary-500"
              value={chapterId}
              onChange={(e) => setChapterId(e.target.value)}
            >
              <option value="" disabled>
                Select Chapter
              </option>

              {chapters.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.title}
                </option>
              ))}
            </select>
          </div>

          {/* Video URL */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Video URL
            </label>

            <input
              type="url"
              placeholder="https://youtube.com/..."
              className="w-full rounded-xl border border-white/10 bg-[#13243A] px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-primary-500"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
          </div>

          {/* Duration + Order */}
          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Duration (minutes)
              </label>

              <input
                type="number"
                min={1}
                placeholder="15"
                className="w-full rounded-xl border border-white/10 bg-[#13243A] px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-primary-500"
                value={duration}
                onChange={(e) => setDuration(e.target.valueAsNumber || 0)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Order
              </label>

              <input
                type="number"
                min={1}
                placeholder="1"
                className="w-full rounded-xl border border-white/10 bg-[#13243A] px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-primary-500"
                value={order}
                onChange={(e) => setOrder(e.target.valueAsNumber || 0)}
              />
            </div>

          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Status
            </label>

            <select
              className="w-full rounded-xl border border-white/10 bg-[#13243A] px-4 py-3 text-white outline-none transition focus:border-primary-500"
              value={status}
              onChange={(e) => setStatus(e.target.value as "draft" | "published")}
            >
              <option value="draft">
                Draft
              </option>

              <option value="published">
                Published
              </option>
            </select>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-10 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 px-6 py-3 text-white transition hover:bg-white/5"
          >
            Cancel
          </button>

          <button
  onClick={async () => {
    await submit({
  title,
  description,
  chapterId,
  courseId,
  videoUrl,
  provider: "youtube",
  durationSeconds: duration * 60,
  isFreePreview: false,
  order,
  status,
});
  }}
  disabled={isLoading}
  className="rounded-xl bg-primary-500 px-6 py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-50"
>
  {isLoading ? "Saving..." : "Save Video"}
</button>

        </div>

      </div>
    </div>
  );
}