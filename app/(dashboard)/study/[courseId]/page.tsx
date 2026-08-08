"use client";

import { notFound, useParams } from "next/navigation";

import ChapterList from "@/components/courses/ChapterList";
import CourseHero from "@/components/courses/CourseHero";
import { useCourseDetails } from "@/hooks/useCourseDetails";

export default function CourseDetailsPage() {
  const params = useParams();

  const courseId = params.courseId as string;

  const {
    course,
    chapters,
    loading,
  } = useCourseDetails(courseId);

  if (!loading && !course) {
    notFound();
  }

  if (loading || !course) {
    return (
      <div className="p-8 text-slate-400">
        Loading course...
      </div>
    );
  }

  return (
    <main className="space-y-8 p-8">
      <CourseHero course={course} />

      <ChapterList
        chapters={chapters}
        loading={loading}
      />
    </main>
  );
}