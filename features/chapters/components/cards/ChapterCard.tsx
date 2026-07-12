"use client";

import { Pencil, Trash2, BookOpen } from "lucide-react";

import { Badge, Card } from "@/components/ui";

import type { Chapter } from "../../types";

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
  return (
    <Card className="transition-all hover:border-primary-500/40">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500/10">
            <BookOpen className="h-6 w-6 text-primary-500" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">
              {chapter.title}
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              /{chapter.slug}
            </p>

            <p className="mt-3 text-sm text-slate-500">
              {chapter.description || "No description"}
            </p>
          </div>
        </div>

        <Badge
          color={
            chapter.status === "published"
              ? "#22C55E"
              : "#F59E0B"
          }
        >
          {chapter.status}
        </Badge>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="text-sm text-slate-400">
          Order #{chapter.order}
        </span>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onEdit?.(chapter)}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <Pencil className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onDelete?.(chapter)}
            className="rounded-lg p-2 text-red-400 transition hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Card>
  );
}