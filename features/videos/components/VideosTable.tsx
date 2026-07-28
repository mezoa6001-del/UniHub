"use client";

import { Card, PrimaryBtn } from "@/components/ui";

import { VideoCard } from "./VideoCard";
import type { Video } from "../types/video.types";

interface VideosTableProps {
  videos: Video[];
  onEdit?: (video: Video) => void;
  onDelete?: (video: Video) => void;
}

export function VideosTable({
  videos,
  onEdit,
  onDelete,
}: VideosTableProps) {
  if (videos.length === 0) {
    return (
      <Card className="py-20">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 text-6xl">🎥</div>

          <h2 className="text-2xl font-bold text-white">
            No Videos Yet
          </h2>

          <p className="mt-3 max-w-md text-slate-400">
            Add your first video to start building this chapter.
          </p>

          <PrimaryBtn className="mt-8">
            + Add First Video
          </PrimaryBtn>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}