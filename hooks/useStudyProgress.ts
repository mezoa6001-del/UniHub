"use client";

import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import {
  getUserAttempts,
  getUserFlashcardProgress,
  getUserVideoProgress,
  getVideos,
  getFlashcards,
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

export function useStudyProgress(chapterId: string) {
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
        const [
  attempts,
  videos,
  flashcards,
  chapterVideos,
  chapterFlashcards,
] = await Promise.all([
  getUserAttempts(user.uid),
  getUserVideoProgress(user.uid),
  getUserFlashcardProgress(user.uid),
  getVideos(chapterId),
  getFlashcards(chapterId),
]);

        const solved = attempts.reduce(
          (sum, a) => sum + (a.totalQuestions ?? 0),
          0
        );

        const wrong = attempts.reduce(
          (sum, a) => sum + (a.wrongCount ?? 0),
          0
        );

        const completed = chapterVideos.filter(
  (video) => videos[video.id]?.completed
).length;

const reviewed = chapterFlashcards.filter(
  (card) => flashcards[card.id]
).length;

        setSolvedQuestions(solved);
        setWrongQuestions(wrong);
        setCompletedVideos(completed);
        setReviewedFlashcards(reviewed);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user, chapterId]);
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