"use client";

import Link from "next/link";
import type { ChapterDoc } from "@/types";

type Props = {
  chapter: ChapterDoc;
  progress?: number;
};

export default function StudyHero({
  chapter,
  progress = 0,
}: Props) {
  return (
    <section
      className="relative overflow-hidden rounded-3xl border border-white/10 p-8"
      style={{
        background: `linear-gradient(135deg, #2FA08422 0%, #0f172a 100%)`,
      }}
    >
      {/* Background Glow */}
      <div
        className="absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl opacity-30"
        style={{
          background: "#2FA084"
        }}
      />

      <div className="relative z-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-3xl text-5xl"
              style={{
                backgroundColor: `#2FA08420`,
              }}
            >
              📚
            </div>

            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
                Study Center
              </p>

              <h1 className="mt-2 text-4xl font-black text-white">
                {chapter.title}
              </h1>

              <p className="mt-2 max-w-xl text-slate-300">
                {chapter.description}
              </p>
            </div>
          </div>

          <Link
            href={`/qbank?chapter=${chapter.id}`}
            className="rounded-2xl bg-primary-500 px-6 py-4 text-center font-bold text-white transition hover:scale-105 hover:opacity-90"
          >
            Continue Learning →
          </Link>
        </div>

        {/* Progress */}
        <div className="mt-10">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-slate-400">
              Progress
            </span>

            <span className="font-bold text-primary-400">
              {progress}%
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${progress}%`,
                background: "#2FA084",
              }}
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <Stat
            value={chapter.videoCount}
            label="Videos"
          />

          <Stat
            value={chapter.flashcardCount}
            label="Flashcards"
          />

          <Stat
            value={chapter.questionCount}
            label="Questions"
          />
        </div>
      </div>
    </section>
  );
}

function Stat({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur">
      <div className="text-3xl font-black text-white">
        {value}
      </div>

      <div className="mt-1 text-xs uppercase tracking-widest text-slate-400">
        {label}
      </div>
    </div>
  );
}