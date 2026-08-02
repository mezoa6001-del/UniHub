"use client";

import { useCallback, useEffect, useState } from "react";

import { listCourses } from "../services/list-courses.service";
import type { Course } from "../types";

export function useListCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await listCourses();
      setCourses(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load courses."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    courses,
    isLoading,
    error,
    reload,
  };
}