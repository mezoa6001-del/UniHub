"use client";

import Link from "next/link";

import type { ChapterDoc } from "@/types";

type ChapterCardProps = {
  chapter: ChapterDoc;
};

export default function ChapterCard({
  chapter,
}: ChapterCardProps) {
  return (
    <Link
      href={`/study/${chapter.courseId}/${chapter.id}`}
      className="block rounded-3xl border border-white/10 bg-navy-card p-6 transition-all duration-200 hover:border-primary-500 hover:bg-white/5"
    >
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {chapter.description}
            </span>

            <h3 className="text-xl font-semibold text-white">
  {chapter.title}
</h3>
          </div>

          <p className="mt-3 text-sm text-slate-400">
            {chapter.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-400">
            <span>🎥 {chapter.videoCount} Videos</span>

            <span>⚡ {chapter.flashcardCount} Flashcards</span>

            <span>📝 {chapter.questionCount} Questions</span>
          </div>
        </div>

        <span className="shrink-0 text-lg font-semibold text-primary-400">
          Continue →
        </span>
      </div>
    </Link>
  );
}