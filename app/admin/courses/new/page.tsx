import { Card } from "@/components/ui";
import { CourseForm } from "@/features/courses/components/forms/course-form";
import { CoursePageHeader } from "@/features/courses/components/layout/CoursePageHeader";

export default function NewCoursePage() {
  return (
    <div className="space-y-8">
      <CoursePageHeader
        title="Create New Course"
        description="Create a new course. You can add chapters, lessons and quizzes later."
        backHref="/admin/courses"
        backLabel="Back to Courses"
      />

      <Card className="max-w-4xl">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            Basic Information
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Enter the basic information about your course.
          </p>
        </div>

        <CourseForm />
      </Card>
    </div>
  );
}