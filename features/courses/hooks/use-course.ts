"use client";

import { useCallback, useEffect, useState } from "react";

import { getCourse } from "../services";
import type { Course } from "../types";

interface UseCourseResult {
  course: Course | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

export function useCourse(
  courseId: string
): UseCourseResult {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCourse = useCallback(async () => {
    if (!courseId) {
      setCourse(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getCourse(courseId);
      setCourse(data);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load course."
      );
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    void loadCourse();
  }, [loadCourse]);

  return {
    course,
    loading,
    error,
    reload: loadCourse,
  };
}