"use client";

import { EmptyState, Spinner } from "@/components/ui";

import type { Chapter } from "../../types";
import { ChapterCard } from "../cards/ChapterCard";

interface ChapterListProps {
  chapters: Chapter[];
  loading: boolean;
  error: string | null;
  onEdit?: (chapter: Chapter) => void;
  onDelete?: (chapter: Chapter) => void;
}

export function ChapterList({
  chapters,
  loading,
  error,
  onEdit,
  onDelete,
}: ChapterListProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-red-400">
        {error}
      </div>
    );
  }

  if (chapters.length === 0) {
    return (
      <EmptyState
        icon="📚"
        title="No chapters yet"
        desc="Create your first chapter to start organizing this course."
      />
    );
  }

  return (
    <div className="space-y-4">
      {chapters.map((chapter) => (
        <ChapterCard
          key={chapter.id}
          chapter={chapter}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}