import { useState } from "react";

import { updateCourse } from "../services/update-course.service";

import type { CurrentUser } from "@/features/shared/types/auth.types";
import type { UpdateCourseInput } from "../validators/update-course.schema";

export function useUpdateCourse(
  currentUser: CurrentUser
) {
  const [loading, setLoading] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function submit(
    courseId: string,
    data: UpdateCourseInput
  ) {
    try {
      setLoading(true);
      setError(null);

      await updateCourse(
        courseId,
        data,
        currentUser
      );

      return true;
    } catch (err) {
      console.error(err);
      setError("Failed to update course.");
      return false;
    } finally {
      setLoading(false);
    }
  }

  return {
    submit,
    loading,
    error,
  };
}