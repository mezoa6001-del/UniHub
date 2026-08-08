"use client";

import { useMemo, useState } from "react";

import type {
  ExamMode,
  QuestionDoc,
} from "@/types";

type UseExamSessionOptions = {
  questions: QuestionDoc[];
  mode: ExamMode;
};

export function useExamSession({
  questions,
  mode,
}: UseExamSessionOptions) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuestion = useMemo(
    () => questions[currentIndex] ?? null,
    [questions, currentIndex]
  );

  function next() {
    setCurrentIndex((prev) =>
      Math.min(prev + 1, questions.length - 1)
    );
  }

  function previous() {
    setCurrentIndex((prev) =>
      Math.max(prev - 1, 0)
    );
  }

  return {
    mode,
    questions,
    currentQuestion,
    currentIndex,
    totalQuestions: questions.length,
    next,
    previous,
  };
}