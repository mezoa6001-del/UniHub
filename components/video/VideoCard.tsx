"use client";

import Link from "next/link";
import type { VideoDoc } from "@/types";

type Props = {
  courseId: string;
  chapterId: string;
  video: VideoDoc;
  completed?: boolean;
};

export default function VideoCard({
  courseId,
  chapterId,
  video,
  completed = false,
}: Props) {
  return (
    <Link
      href={`/study/${courseId}/${chapterId}/videos/${video.id}`}
      className="group block rounded-3xl border border-white/10 bg-[#111C33] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary-500"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-500/10 text-2xl">
            ▶️
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">
              {video.title}
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              {video.description}
            </p>
          </div>
        </div>

        {completed && (
          <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
            Completed
          </span>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
        <span>
          🎬 Lesson {video.order}
        </span>

        <span className="transition-transform group-hover:translate-x-1">
          Watch →
        </span>
      </div>
    </Link>
  );
}