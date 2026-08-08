"use client";

import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useStudyCenter } from "@/hooks/useStudyCenter";
import { useStudyProgress } from "@/hooks/useStudyProgress";

import StudyHero from "@/components/study/StudyHero";
import StudyGrid from "@/components/study/StudyGrid";
import AnalyticsCard from "@/components/study/AnalyticsCard";
import MasteryCard from "@/components/study/MasteryCard";

export default function StudyPage() {
  const params = useParams();
  const chapterId = params.chapterId as string;
console.log("courseId:", params.courseId);
console.log("chapterId:", params.chapterId);
  const {
    loading,
    chapter,
    videos,
    flashcards,
    questions,
  } = useStudyCenter(chapterId);
  const studyProgress = useStudyProgress(chapterId);

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
      <StudyHero
  chapter={chapter}
  progress={studyProgress.progress}
/>

      {/* Study Resources */}
      <StudyGrid
  courseId={chapter.courseId}
  chapterId={chapter.id}
  videoCount={videos.length}
  flashcardCount={flashcards.length}
  questionCount={questions.length}
/>

      {/* Analytics + Mastery */}
      <div className="grid gap-6 lg:grid-cols-2">
        <AnalyticsCard
  solved={studyProgress.solvedQuestions}
  accuracy={studyProgress.accuracy}
  wrong={studyProgress.wrongQuestions}
  streak={studyProgress.streak}
/>

        <MasteryCard
  progress={studyProgress.progress}
/>
      </div>
    </div>
  );
}