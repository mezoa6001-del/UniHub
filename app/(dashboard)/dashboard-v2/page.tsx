"use client";

import ContinueCard from "@/components/dashboard/ContinueCard";
import DashboardHero from "@/components/dashboard/DashboardHero";
import MyCoursesCard from "@/components/dashboard/MyCoursesCard";

import { useAuth } from "@/hooks/useAuth";
import { useCourses } from "@/hooks/useCourses";
import { useResumeLearning } from "@/hooks/useResumeLearning";

export default function DashboardV2() {
  const { profile, sub } = useAuth();
  const { courses, loading } = useCourses();

  const { resume } = useResumeLearning(profile?.uid);

  return (
    <div className="space-y-8 p-8">
      <DashboardHero
        profile={profile}
        subscription={sub}
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <ContinueCard
  chapterName="Continue Learning"
          progress={resume?.overallProgress ?? 0}
          href={
            resume?.courseId &&
            resume?.chapterId &&
            resume?.currentVideoId
              ? `/study/${resume.courseId}/${resume.chapterId}/videos/${resume.currentVideoId}`
              : "/courses"
          }
        />

        <MyCoursesCard
          courses={courses}
          loading={loading}
        />
      </div>
    </div>
  );
} 