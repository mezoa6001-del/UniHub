"use client";

import { useEffect, useState } from "react";
import {
  getChapter,
  getQuestions,
  getVideos,
  getFlashcards,
} from "@/lib/firebase/firestore";
import type {
  ChapterDoc,
  FlashcardDoc,
  QuestionDoc,
  VideoDoc,
} from "@/types";

export function useStudyCenter(chapterId: string) {
  const [chapter, setChapter] = useState<ChapterDoc | null>(null);
  const [questions, setQuestions] = useState<QuestionDoc[]>([]);
  const [videos, setVideos] = useState<VideoDoc[]>([]);
  const [flashcards, setFlashcards] = useState<FlashcardDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);

        const chapter = await getChapter(chapterId);

        const [qs, vids, cards] = await Promise.all([
          getQuestions(chapterId),
          getVideos(chapterId),
          getFlashcards(chapterId),
        ]);

        if (!mounted) return;

        setChapter(chapter);
        setQuestions(qs);
        setVideos(vids);
        setFlashcards(cards);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [chapterId]);

  return {
    loading,
    chapter,
    questions,
    videos,
    flashcards,
  };
}