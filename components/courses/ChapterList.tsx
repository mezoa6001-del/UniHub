"use client";

import type { ChapterDoc } from "@/types";

import ChapterCard from "./ChapterCard";

type ChapterListProps = {
  chapters: ChapterDoc[];
  loading: boolean;
};

export default function ChapterList({
  chapters,
  loading,
}: ChapterListProps) {
  if (loading) {
    return (
      <section className="rounded-3xl border border-white/10 bg-navy-card p-8">
        <h2 className="text-2xl font-bold text-white">
          Chapters
        </h2>

        <p className="mt-4 text-slate-400">
          Loading chapters...
        </p>
      </section>
    );
  }

  if (chapters.length === 0) {
    return (
      <section className="rounded-3xl border border-white/10 bg-navy-card p-8">
        <h2 className="text-2xl font-bold text-white">
          Chapters
        </h2>

        <p className="mt-4 text-slate-400">
          No chapters have been added to this course yet.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">
          Chapters
        </h2>

        <p className="mt-1 text-slate-400">
          Select a chapter to start studying.
        </p>
      </div>

      <div className="space-y-4">
        {chapters.map((chapter) => (
          <ChapterCard
            key={chapter.id}
            chapter={chapter}
          />
        ))}
      </div>
    </section>
  );
}