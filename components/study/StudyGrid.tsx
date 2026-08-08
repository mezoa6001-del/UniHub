"use client";

import StudyCard from "./StudyCard";

type Props = {
  courseId: string;
  chapterId: string;
  videoCount: number;
  flashcardCount: number;
  questionCount: number;
};

export default function StudyGrid({
  courseId,
  chapterId,
  videoCount,
  flashcardCount,
  questionCount,
}: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <StudyCard
        title="Videos"
        description="Watch chapter lessons and continue where you left off."
        icon="🎥"
        count={videoCount}
        unit="Videos"
        accentColor="#3B82F6"
        href={`/study/${courseId}/${chapterId}/videos`}
      />

      <StudyCard
        title="Flashcards"
        description="Review high-yield flashcards for this chapter."
        icon="📚"
        count={flashcardCount}
        unit="Cards"
        accentColor="#8B5CF6"
        href={`/study/${courseId}/${chapterId}/flashcards`}
      />

      <StudyCard
        title="Question Bank"
        description="Practice exam-style questions with explanations."
        icon="📝"
        count={questionCount}
        unit="Questions"
        accentColor="#10B981"
        href={`/study/${courseId}/${chapterId}/questions`}
      />
    </div>
  );
}