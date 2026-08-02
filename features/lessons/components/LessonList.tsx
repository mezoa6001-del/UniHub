import type { Lesson } from "../types";
import { LessonCard } from "./cards/LessonCard";

type LessonListProps = {
  lessons: Lesson[];
  onEdit?: (lesson: Lesson) => void;
  onDelete?: (lesson: Lesson) => void;
};

export function LessonList({
  lessons,
  onEdit,
  onDelete,
}: LessonListProps) {
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
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}