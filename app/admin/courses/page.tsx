"use client";

import { useState } from "react";
import Link from "next/link";
import { PrimaryBtn, Spinner } from "@/components/ui";
import { EditCourseDialog } from "@/features/courses/components/dialogs/EditCourseDialog";
import { CourseFilters } from "@/features/courses/components/filters/CourseFilters";
import { CoursesTable } from "@/features/courses/components/tables/CoursesTable";
import { useCourseFilters } from "@/features/courses/hooks/use-course-filters";
import { useCourses } from "@/features/courses/hooks/use-courses";
import type { Course } from "@/features/courses/types";
import { DeleteCourseDialog } from "@/features/courses/components/dialogs/DeleteCourseDialog";
export default function CoursesPage() {
  const {
  courses,
  loading,
  error,
  reload,
} = useCourses();
  const {
    search,
    status,
    setSearch,
    setStatus,
    filteredCourses,
  } = useCourseFilters(courses);
  const [editingCourse, setEditingCourse] =
  useState<Course | null>(null);

const [deletingCourse, setDeletingCourse] =
  useState<Course | null>(null);
  console.log({
  editingCourse,
  deletingCourse,
});

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
  <CoursesTable
    courses={filteredCourses}
    onEdit={setEditingCourse}
    onDelete={setDeletingCourse}
  />
)}

<EditCourseDialog
  open={editingCourse !== null}
  course={editingCourse}
  onClose={() => setEditingCourse(null)}
  onUpdated={async () => {
    await reload();
    setEditingCourse(null);
  }}
/>     
<DeleteCourseDialog
  open={deletingCourse !== null}
  course={deletingCourse}
  onClose={() => setDeletingCourse(null)}
  onDeleted={async () => {
    await reload();
    setDeletingCourse(null);
  }}
/> 
    </div>
  );
}
