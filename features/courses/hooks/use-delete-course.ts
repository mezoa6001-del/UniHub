import { useState } from "react";

import { deleteCourse } from "../services";

import type { CurrentUser } from "@/features/shared/types/auth.types";

export function useDeleteCourse(
  currentUser: CurrentUser
) {
  const [loading, setLoading] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function submit(courseId: string) {
    try {
      setLoading(true);
      setError(null);

      await deleteCourse(
        courseId,
        currentUser
      );

      return true;
    } catch (err) {
      console.error(err);
      setError("Failed to delete course.");
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