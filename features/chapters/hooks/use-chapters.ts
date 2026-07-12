"use client";

import { useCallback, useEffect, useState } from "react";

import { listChapters } from "../services";
import type { Chapter } from "../types";

interface UseChaptersResult {
  chapters: Chapter[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

export function useChapters(
  courseId: string
): UseChaptersResult {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadChapters = useCallback(async () => {
    if (!courseId) {
      setChapters([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await listChapters(courseId);
      setChapters(data);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load chapters."
      );
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    void loadChapters();
  }, [loadChapters]);

  return {
    chapters,
    loading,
    error,
    reload: loadChapters,
  };
}