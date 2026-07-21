"use client";

import { useState } from "react";

import { createQuestion } from "../services";
import type { CreateQuestionInput } from "../validators";
import type { CurrentUser } from "@/features/shared/types/auth.types";

export function useCreateQuestion(currentUser: CurrentUser) {
  const [loading, setLoading] = useState(false);

  async function submit(data: CreateQuestionInput) {
    try {
      setLoading(true);

      const question = await createQuestion(
        data,
        currentUser
      );

      return question;
    } finally {
      setLoading(false);
    }
  }

  return {
    submit,
    loading,
  };
}