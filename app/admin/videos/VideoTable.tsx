"use client";

import type { VideoDoc } from "@/types";
import VideoRow from "./VideoRow";

interface VideoTableProps {
  videos: VideoDoc[];
  onEdit: (video: VideoDoc) => void;
  onDelete: (video: VideoDoc) => void;
}

export default function VideoTable({
  videos,
  onEdit,
  onDelete,
}: VideoTableProps) {
  if (videos.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        No videos found.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {videos.map((video) => (
        <VideoRow
          key={video.id}
          video={video}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}