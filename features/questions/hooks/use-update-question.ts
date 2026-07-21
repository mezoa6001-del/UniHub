"use client";

import { useState } from "react";

import { updateQuestion } from "../services";
import type { UpdateQuestionInput } from "../validators";

export function useUpdateQuestion() {
  const [loading, setLoading] = useState(false);

  async function submit(
    questionId: string,
    data: UpdateQuestionInput
  ) {
    try {
      setLoading(true);

      await updateQuestion(questionId, data);
    } finally {
      setLoading(false);
    }
  }

  return {
    submit,
    loading,
  };
}