"use client";

import Link from "next/link";

import type { CourseDoc } from "@/types";

type MyCoursesCardProps = {
  courses: CourseDoc[];
  loading: boolean;
};

export default function MyCoursesCard({
  courses,
  loading,
}: MyCoursesCardProps) {
  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-navy-card p-6">
        <h2 className="text-xl font-bold text-white">
          My Courses
        </h2>

        <p className="mt-4 text-slate-400">
          Loading courses...
        </p>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-navy-card p-6">
        <h2 className="text-xl font-bold text-white">
          My Courses
        </h2>

        <p className="mt-4 text-slate-400">
          You do not have any courses yet.
        </p>

        <Link
          href="/courses"
          className="mt-6 inline-flex text-sm font-semibold text-primary-400 hover:text-primary-300"
        >
          Browse Courses →
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-navy-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">
          My Courses
        </h2>

        <Link
          href="/courses"
          className="text-sm font-semibold text-primary-400 hover:text-primary-300"
        >
          View All →
        </Link>
      </div>

      <div className="mt-6 space-y-4">
        {courses.slice(0, 3).map((course) => (
          <Link
            key={course.id}
            href={`/study/${course.id}`}
            className="flex items-center justify-between rounded-2xl border border-white/10 p-4 transition-all duration-200 hover:border-primary-500 hover:bg-white/5"
          >
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-white">
                {course.title}
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                {course.description}
              </p>
            </div>

            <span className="ml-4 text-xl text-primary-400">
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}