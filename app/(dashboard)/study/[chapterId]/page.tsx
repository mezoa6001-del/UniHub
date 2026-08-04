"use client";

import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useStudyCenter } from "@/hooks/useStudyCenter";
import StudyGrid from "@/components/study/StudyGrid";

export default function StudyPage() {
  const params = useParams();
  const chapterId = params.chapterId as string;

  const {
    loading,
    chapter,
    videos,
    flashcards,
    questions,
  } = useStudyCenter(chapterId);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8">
        <h2 className="text-xl font-bold text-red-400">
          Chapter not found
        </h2>

        <p className="mt-2 text-slate-400">
          The requested chapter does not exist.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div
        className="rounded-3xl border border-white/10 p-8"
        style={{
          background: `linear-gradient(135deg, ${chapter.color}22, #0f172a)`,
        }}
      >
        <div className="flex items-center gap-4">
          <div className="text-6xl">
            {chapter.icon}
          </div>

          <div>
            <h1 className="text-4xl font-black text-white">
              {chapter.name}
            </h1>

            <p className="mt-2 text-slate-300">
              Everything you need to master this chapter.
            </p>
          </div>
        </div>
      </div>

      {/* Study Resources */}
      <StudyGrid
        chapterId={chapter.id}
        videoCount={videos.length}
        flashcardCount={flashcards.length}
        questionCount={questions.length}
      />
    </div>
  );
}