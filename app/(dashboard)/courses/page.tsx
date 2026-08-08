"use client";

import Link from "next/link";

import { useCourses } from "@/hooks/useCourses";

export default function StudyPage() {
  const { courses, loading } = useCourses();
  if (loading) {
    return (
      <div className="p-8 text-white">
        Loading study...
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-4xl font-black text-white">
          Study
        </h1>

        <p className="mt-2 text-slate-400">
          Choose a chapter to continue learning.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/study/${course.id}`}
            className="rounded-3xl border border-white/10 bg-navy-card p-6 transition hover:scale-[1.02] hover:border-primary-500"
          >
            <div className="text-5xl">
              {course.thumbnailUrl}
            </div>

            <h2 className="mt-4 text-2xl font-bold text-white">
              {course.title}
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              {course.description}
            </p>

            <div className="mt-6 flex justify-between text-sm text-slate-300">
              <span>📚 Course</span>
<span>{course.status}</span>
            </div>

            <div className="mt-6 text-primary-400 font-semibold">
              Continue Learning →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}