"use client";

import Link from "next/link";

import { PrimaryBtn, Spinner } from "@/components/ui";

import { CourseFilters } from "@/features/courses/components/filters/CourseFilters";
import { CoursesTable } from "@/features/courses/components/tables/CoursesTable";
import { useCourseFilters } from "@/features/courses/hooks/use-course-filters";
import { useCourses } from "@/features/courses/hooks/use-courses";

export default function CoursesPage() {
  const {
    courses,
    loading,
    error,
  } = useCourses();

  const {
    search,
    status,
    setSearch,
    setStatus,
    filteredCourses,
  } = useCourseFilters(courses);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Courses
          </h1>

          <p className="mt-1 text-slate-400">
            Manage all platform courses.
          </p>
        </div>

        <Link href="/admin/courses/new">
          <PrimaryBtn>
            + New Course
          </PrimaryBtn>
        </Link>
      </div>

      <CourseFilters
        search={search}
        status={status}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
      />

      {loading && (
        <div className="flex justify-center py-20">
          <Spinner size={40} />
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && (
        <CoursesTable courses={filteredCourses} />
      )}
    </div>
  );
}