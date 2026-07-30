"use client";

import { Badge, Card, PrimaryBtn } from "@/components/ui";

import type { Chapter } from "../../types";
import { useRouter } from "next/navigation";
interface ChapterCardProps {
  chapter: Chapter;
  onEdit?: (chapter: Chapter) => void;
  onDelete?: (chapter: Chapter) => void;
}

export function ChapterCard({
  chapter,
  onEdit,
  onDelete,
}: ChapterCardProps) {
    const router = useRouter();
  return (
    <Card className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-3">
            <h3 className="truncate text-lg font-bold text-white">
              {chapter.title}
            </h3>

            <Badge
              color={
                chapter.status === "published"
                  ? "#2FA084"
                  : "#F59E0B"
              }
            >
              {chapter.status}
            </Badge>
          </div>

          <p className="line-clamp-2 text-sm text-slate-400">
            {chapter.description || "No description"}
          </p>
        </div>

        <div className="rounded-lg bg-slate-800 px-3 py-2 text-center">
          <div className="text-xs text-slate-400">
            Order
          </div>

          <div className="text-lg font-bold text-white">
            {chapter.order}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
  <PrimaryBtn
    onClick={() => onEdit?.(chapter)}
  >
    Edit
  </PrimaryBtn>

  <PrimaryBtn
    className="bg-indigo-600 hover:bg-indigo-700"
    onClick={() =>
      router.push(
        `/admin/chapters/${chapter.id}/lessons`
      )
    }
  >
    Lessons
  </PrimaryBtn>

  <PrimaryBtn
    className="bg-red-600 hover:bg-red-700"
    onClick={() => onDelete?.(chapter)}
  >
    Delete
  </PrimaryBtn>
</div>
    </Card>
  );
}