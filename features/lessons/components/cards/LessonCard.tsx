import type { Lesson } from "../../types";

type LessonCardProps = {
  lesson: Lesson;
  onEdit?: (lesson: Lesson) => void;
  onDelete?: (lesson: Lesson) => void;
};

export function LessonCard({
  lesson,
  onEdit,
  onDelete,
}: LessonCardProps) {
  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{lesson.title}</h3>

          <p className="text-sm text-gray-500">
            Order: {lesson.order}
          </p>

          <span
            className={`mt-2 inline-block rounded px-2 py-1 text-xs ${
              lesson.status === "published"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {lesson.status}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit?.(lesson)}
            className="rounded bg-blue-600 px-3 py-2 text-white"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete?.(lesson)}
            className="rounded bg-red-600 px-3 py-2 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}