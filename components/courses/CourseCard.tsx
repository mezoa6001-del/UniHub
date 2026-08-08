"use client";

import Link from "next/link";

type Props = {
  id: string;
  title: string;
  description: string;
  chapters: number;
  progress: number;
};

export default function CourseCard({
  id,
  title,
  description,
  chapters,
  progress,
}: Props) {
  return (
    <Link
      href={`/study/${id}`}
      className="group block rounded-3xl border border-white/10 bg-navy-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary-500 hover:shadow-xl hover:shadow-primary-500/10"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-500/15 text-3xl">
          📚
        </div>

        <span className="rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-400">
          {chapters} Chapters
        </span>
      </div>

      <h2 className="mt-6 text-2xl font-bold text-white">
        {title}
      </h2>

      <p className="mt-2 line-clamp-2 text-sm text-slate-400">
        {description}
      </p>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-slate-400">
            Progress
          </span>

          <span className="font-semibold text-primary-400">
            {progress}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-primary-500 transition-all"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
        <span className="text-sm text-slate-400">
          Continue learning
        </span>

        <span className="font-semibold text-primary-400 transition-transform group-hover:translate-x-1">
          →
        </span>
      </div>
    </Link>
  );
}