import { LessonDetailsPage } from "@/features/lessons/components/layout/LessonDetailsPage";

interface PageProps {
  params: Promise<{
    courseId: string;
    chapterId: string;
  }>;
}

export default async function Page({
  params,
}: PageProps) {
  const {
    courseId,
    chapterId,
  } = await params;

  return (
    <LessonDetailsPage
      courseId={courseId}
      chapterId={chapterId}
    />
  );
}