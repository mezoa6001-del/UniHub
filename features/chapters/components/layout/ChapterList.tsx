"use client";

import { EmptyState, Spinner } from "@/components/ui";

import { ChapterCard } from "../cards/ChapterCard";
import type { Chapter } from "../../types";

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
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon="⚠️"
        title="Failed to load chapters"
        desc={error}
      />
    );
  }

  if (chapters.length === 0) {
    return (
      <EmptyState
        icon="📚"
        title="No chapters yet"
        desc="Create your first chapter to start building the course."
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