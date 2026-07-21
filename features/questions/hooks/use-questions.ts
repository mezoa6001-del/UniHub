"use client";

import { useCallback, useEffect, useState } from "react";

import { listQuestions } from "../services";
import type { Question } from "../types";

export function useQuestions(
  chapterId: string
) {
  const [questions, setQuestions] =
    useState<Question[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data =
        await listQuestions(chapterId);

      setQuestions(data);
    } catch (err) {
      console.error(err);

      setError("Failed to load questions.");
    } finally {
      setLoading(false);
    }
  }, [chapterId]);

  useEffect(() => {
    if (!chapterId) return;

    loadQuestions();
  }, [chapterId, loadQuestions]);

  return {
    questions,
    loading,
    error,
    reload: loadQuestions,
  };
}