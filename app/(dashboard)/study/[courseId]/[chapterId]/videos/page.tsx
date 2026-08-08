"use client";

import { useParams } from "next/navigation";

import VideosList from "@/components/video/VideosList";
import { useVideos } from "@/hooks/useVideos";

export default function VideosPage() {
  const params = useParams();

  const courseId = params.courseId as string;
  const chapterId = params.chapterId as string;

  const {
    videos,
    loading,
  } = useVideos(chapterId);

  return (
    <main className="space-y-8 p-8">
      <div>
        <h1 className="text-4xl font-black text-white">
          Videos
        </h1>

        <p className="mt-2 text-slate-400">
          Watch all lectures in this chapter.
        </p>
      </div>

      <VideosList
        courseId={courseId}
        chapterId={chapterId}
        videos={videos}
        loading={loading}
      />
    </main>
  );
}