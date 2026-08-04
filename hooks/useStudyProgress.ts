"use client";

import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import {
  getUserAttempts,
  getUserFlashcardProgress,
  getUserVideoProgress,
} from "@/lib/firebase/firestore";

export interface StudyProgress {
  loading: boolean;

  solvedQuestions: number;
  wrongQuestions: number;
  accuracy: number;

  completedVideos: number;
  reviewedFlashcards: number;

  streak: number;
  progress: number;
}

export function useStudyProgress(): StudyProgress {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);

  const [solvedQuestions, setSolvedQuestions] = useState(0);
  const [wrongQuestions, setWrongQuestions] = useState(0);

  const [completedVideos, setCompletedVideos] = useState(0);
  const [reviewedFlashcards, setReviewedFlashcards] = useState(0);

  useEffect(() => {
    async function load() {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const [attempts, videos, flashcards] = await Promise.all([
          getUserAttempts(user.uid),
          getUserVideoProgress(user.uid),
          getUserFlashcardProgress(user.uid),
        ]);

        const solved = attempts.reduce(
          (sum, a) => sum + (a.totalQuestions ?? 0),
          0
        );

        const wrong = attempts.reduce(
          (sum, a) => sum + (a.wrongCount ?? 0),
          0
        );

        const completed = Object.values(videos).filter(
          (v) => v.completed
        ).length;

        const reviewed = Object.keys(flashcards).length;

        setSolvedQuestions(solved);
        setWrongQuestions(wrong);
        setCompletedVideos(completed);
        setReviewedFlashcards(reviewed);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user]);

  const accuracy = useMemo(() => {
    if (solvedQuestions === 0) return 0;

    return Math.round(
      ((solvedQuestions - wrongQuestions) / solvedQuestions) * 100
    );
  }, [solvedQuestions, wrongQuestions]);

  const progress = useMemo(() => {
    return Math.min(
      100,
      Math.round(
        solvedQuestions * 0.1 +
          completedVideos * 5 +
          reviewedFlashcards * 2
      )
    );
  }, [
    solvedQuestions,
    completedVideos,
    reviewedFlashcards,
  ]);

  return {
    loading,
    solvedQuestions,
    wrongQuestions,
    completedVideos,
    reviewedFlashcards,
    accuracy,
    progress,
    streak: 0,
  };
}