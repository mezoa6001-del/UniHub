"use client";

import type { CourseDoc } from "@/types";

type CourseHeroProps = {
  course: CourseDoc;
};

export default function CourseHero({
  course,
}: CourseHeroProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-navy-card p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <span className="inline-flex rounded-full border border-primary-500/30 bg-primary-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-400">
            Course
          </span>

          <h1 className="mt-4 text-4xl font-bold text-white">
            {course.title}
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-400">
            {course.description}
          </p>
        </div>

        <div className="flex shrink-0 gap-4">
          <div className="rounded-2xl border border-white/10 bg-[#0F1E35] px-6 py-4 text-center">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Status
            </p>

            <p className="mt-2 font-semibold capitalize text-white">
              {course.status}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}