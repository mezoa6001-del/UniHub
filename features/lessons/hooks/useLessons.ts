"use client";

import { useCallback, useEffect, useState } from "react";

import { listLessons } from "../services";
import type { Lesson } from "../types";

interface UseLessonsResult {
  lessons: Lesson[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

export function useLessons(
  chapterId: string
): UseLessonsResult {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLessons = useCallback(async () => {
    if (!chapterId) {
      setLessons([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await listLessons(chapterId);
      setLessons(data);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load lessons."
      );
    } finally {
      setLoading(false);
    }
  }, [chapterId]);

  useEffect(() => {
    void loadLessons();
  }, [loadLessons]);

  return {
    lessons,
    loading,
    error,
    reload: loadLessons,
  };
}