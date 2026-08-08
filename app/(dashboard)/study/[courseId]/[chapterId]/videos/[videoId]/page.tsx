"use client";

import { notFound, useParams } from "next/navigation";

import { useVideo } from "@/hooks/useVideo";
import { useAuth } from "@/hooks/useAuth";
import { recordVideoCompletion } from "@/lib/learning";
export default function VideoPlayerPage() {
  const params = useParams();

  const courseId = params.courseId as string;
  const chapterId = params.chapterId as string;
  const videoId = params.videoId as string;

  const {
    video,
    loading,
  } = useVideo(videoId);
  const { profile } = useAuth();

  if (!loading && !video) {
    notFound();
  }

  if (loading || !video) {
    return (
      <div className="p-8 text-slate-400">
        Loading video...
      </div>
    );
  }
async function handleComplete() {
  if (!profile || !video) return;

  await recordVideoCompletion({
    userId: profile.uid,

    courseId,
    

    chapterId,
    

    videoId,

    watchedSeconds: video.duration,
    totalSeconds: video.duration,
  });

  alert("Video marked as completed ✅");
}
  return (
    <main className="mx-auto max-w-6xl space-y-8 p-8">
      <div>
        <p className="text-sm uppercase tracking-widest text-slate-400">
          Lesson {video.order}
        </p>

        <h1 className="mt-2 text-4xl font-black text-white">
          {video.title}
        </h1>

        <p className="mt-4 text-slate-400">
          {video.description}
        </p>
      </div>

      {/* Video Placeholder */}
      <div className="flex aspect-video items-center justify-center rounded-3xl border border-white/10 bg-[#111C33]">
        <p className="text-slate-400">
          🎥 Video Player Placeholder
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        <button 
          onClick={handleComplete}
          className="rounded-2xl bg-primary-500 px-6 py-4 font-bold text-white transition hover:opacity-90"
        >
          ✅ Mark as Completed
        </button>

        <button className="rounded-2xl border border-white/10 px-6 py-4 font-bold text-white transition hover:bg-white/5">
          ← Back to Videos
        </button>
      </div>
    </main>
  );
}