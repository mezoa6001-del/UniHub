"use client";

import MyCoursesCard from "@/components/dashboard/MyCoursesCard";
import ContinueCard from "@/components/dashboard/ContinueCard";

import { useCourses } from "@/hooks/useCourses";
import { useResumeLearning } from "@/hooks/useResumeLearning";

export default function StudyPage() {
  const { courses, loading } = useCourses();
  const { resume } = useResumeLearning();

  return (
    <main className="space-y-8 p-8">
      <h1 className="text-4xl font-black text-white">
        Study
      </h1>

      <ContinueCard
        chapterName="Continue Learning"
        progress={resume?.overallProgress ?? 0}
        href={
          resume
            ? `/study/${resume.courseId}/${resume.chapterId}/videos/${resume.currentVideoId}`
            : "/courses"
        }
      />

      <MyCoursesCard
        courses={courses}
        loading={loading}
      />
    </main>
  );
}