"use client";

import { formatDuration } from "@/lib/utils/formatters";
import type { VideoDoc } from "@/types";

interface VideoRowProps {
  video: VideoDoc;
  onEdit: (video: VideoDoc) => void;
  onDelete: (video: VideoDoc) => void;
}

export default function VideoRow({
  video,
  onEdit,
  onDelete,
}: VideoRowProps) {
  return (
    <div className="bg-navy-card rounded-2xl p-4 border border-white/8 flex items-center gap-4">
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-navy to-navy-light flex items-center justify-center text-2xl shrink-0">
        🎬
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-bold text-white text-sm mb-1">
          {video.title}
        </p>

        <p className="text-xs text-slate-400">
          {video.instructorName} · {formatDuration(video.duration)} ·{" "}
          <span
            style={{
              color: video.isPublished ? "#2FA084" : "#F59E0B",
            }}
          >
            {video.isPublished ? "Published" : "Draft"}
          </span>
        </p>
      </div>

      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => onEdit(video)}
          className="text-xs font-bold px-3 py-1.5 rounded-lg text-blue-400 border border-blue-500/30"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(video)}
          className="text-xs font-bold px-3 py-1.5 rounded-lg text-red-400 border border-red-500/30"
        >
          Delete
        </button>
      </div>
    </div>
  );
}