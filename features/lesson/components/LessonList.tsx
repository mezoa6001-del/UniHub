import type { Lesson } from "../types";
import { LessonCard } from "./cards/LessonCard";

type LessonListProps = {
  lessons: Lesson[];
};

export function LessonList({ lessons }: LessonListProps) {
  if (lessons.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-gray-500">
        No lessons found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {lessons.map((lesson) => (
        <LessonCard
          key={lesson.id}
          lesson={lesson}
        />
      ))}
    </div>
  );
}