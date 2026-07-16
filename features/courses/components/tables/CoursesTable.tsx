"use client";

import Link from "next/link";

import { Card, PrimaryBtn } from "@/components/ui";

import { CourseCard } from "../cards/CourseCard";
import type { Course } from "../../types";

interface CoursesTableProps {
  courses: Course[];
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
}

export function CoursesTable({
  courses,
  onEdit,
  onDelete,
}: CoursesTableProps) {
  if (courses.length === 0) {
    return (
      <Card className="py-20">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 text-6xl">📚</div>

          <h2 className="text-2xl font-bold text-white">
            No Courses Yet
          </h2>

          <p className="mt-3 max-w-md text-slate-400">
            Create your first course to start building your learning platform.
          </p>

          <Link
            href="/admin/courses/new"
            className="mt-8"
          >
            <PrimaryBtn>
              + Create First Course
            </PrimaryBtn>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {courses.map((course) => (
        <CourseCard
  key={course.id}
  course={course}
  onEdit={onEdit}
  onDelete={onDelete}
/>
      ))}
    </div>
  );
}