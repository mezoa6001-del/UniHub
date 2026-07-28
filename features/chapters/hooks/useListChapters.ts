"use client";

import { useCallback, useEffect, useState } from "react";

import { listChapters } from "../services/list-chapters.service";
import type { Chapter } from "../types";

export function useListChapters(courseId: string) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!courseId) {
      setChapters([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await listChapters(courseId);
      setChapters(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to load chapters.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    chapters,
    isLoading,
    error,
    reload,
  };
}