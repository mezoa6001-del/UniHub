"use client";

import type { VideoDoc } from "@/types";

import VideoCard from "./VideoCard";

type Props = {
  courseId: string;
  chapterId: string;
  videos: VideoDoc[];
  loading: boolean;
};

export default function VideosList({
  courseId,
  chapterId,
  videos,
  loading,
}: Props) {
  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#111C33] p-8">
        <p className="text-slate-400">
          Loading videos...
        </p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#111C33] p-8">
        <p className="text-slate-400">
          No videos available for this chapter.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          courseId={courseId}
          chapterId={chapterId}
          video={video}
        />
      ))}
    </div>
  );
}