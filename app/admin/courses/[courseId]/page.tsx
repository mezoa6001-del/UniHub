import { CourseDetailsPage } from "../../../../features/courses/components/layout/CourseDetailsPage";

interface PageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function Page({
  params,
}: PageProps) {
  const { courseId } = await params;

  return <CourseDetailsPage courseId={courseId} />;
}