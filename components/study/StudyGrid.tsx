"use client";

import StudyCard from "./StudyCard";

type Props = {
  chapterId: string;
  videoCount: number;
  flashcardCount: number;
  questionCount: number;
};

export default function StudyGrid({
  chapterId,
  videoCount,
  flashcardCount,
  questionCount,
}: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <StudyCard
        title="Videos"
        subtitle="Watch course lessons"
        count={videoCount}
        icon="🎥"
        color="#3B82F6"
        href={`/videos?chapter=${chapterId}`}
      />

      <StudyCard
        title="Flashcards"
        subtitle="Review high-yield cards"
        count={flashcardCount}
        icon="📚"
        color="#8B5CF6"
        href={`/flashcards?chapter=${chapterId}`}
      />

      <StudyCard
        title="Question Bank"
        subtitle="Practice exam questions"
        count={questionCount}
        icon="📝"
        color="#10B981"
        href={`/qbank?chapter=${chapterId}`}
      />
    </div>
  );
}