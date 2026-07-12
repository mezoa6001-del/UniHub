"use client";

import { useCallback, useEffect, useState } from "react";

import { listCourses } from "../services";
import type { Course } from "../types";

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await listCourses();
      setCourses(data);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load courses."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  return {
    courses,
    loading,
    error,
    reload: loadCourses,
  };
}