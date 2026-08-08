"use client";

import Link from "next/link";

type ContinueCardProps = {
  chapterName?: string;
  progress?: number;
  href?: string;
};

export default function ContinueCard({
  chapterName = "No active chapter",
  progress = 0,
  href = "/courses",
}: ContinueCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-navy-card p-6">
      <p className="text-sm font-medium text-slate-400">
        Continue Learning
      </p>

      <h2 className="mt-2 text-2xl font-bold text-white">
        {chapterName}
      </h2>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-slate-400">Progress</span>
          <span className="font-semibold text-primary-400">
            {progress}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-primary-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <Link
        href={href}
        className="mt-6 inline-flex items-center font-semibold text-primary-400 hover:text-primary-300"
      >
        Continue →
      </Link>
    </div>
  );
}