"use client";

import { useEffect, useState } from "react";
import {
  getChapters,
  getQuestions,
  createQuestion,
  updateQuestion,
  softDeleteQuestion,
} from "@/lib/firebase/firestore";
import { auth } from "@/lib/firebase/config";

import type { ChapterDoc, QuestionDoc } from "@/types";
import {
  createBlankQuestion,
  QuestionForm,
  QuestionModalState,
} from "./types";

export function useQuestionManager() {
  const [chapters, setChapters] = useState<ChapterDoc[]>([]);
  const [questions, setQuestions] = useState<QuestionDoc[]>([]);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] =
    useState<QuestionModalState | null>(null);

  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  async function load() {
    setLoading(true);

    try {
      const [chs, qs] = await Promise.all([
        getChapters(),
        getQuestions(),
      ]);

      setChapters(chs);
      setQuestions(qs);
    } catch {
      setToast({
        msg: "Failed to load questions",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openAddModal() {
    setModal({
      mode: "add",
      data: createBlankQuestion(),
    });
  }

  function openEditModal(question: QuestionDoc) {
    setModal({
      mode: "edit",
      data: question,
    });
  }

  function closeModal() {
    setModal(null);
  }

  async function saveQuestion(form: QuestionForm) {
    const currentModal = modal;
    const mode = currentModal?.mode;
    const chapter = chapters.find(
      (c) => c.id === form.chapterId
    );

    const payload = {
  ...form,
  chapterName: chapter?.name ?? form.chapterId,
  type: "single" as const,

  ...(form.source ? { source: form.source } : {}),
  ...(form.year !== undefined ? { year: form.year } : {}),
};

    try {
      if (mode === "add") {
        const createdBy = auth.currentUser?.uid;

        if (!createdBy) {
          throw new Error("Authenticated user is required");
        }

        await createQuestion({
          ...payload,
          createdBy,
        });
      } else if (
        currentModal?.mode === "edit" &&
        "id" in currentModal.data
      ) {
        await updateQuestion(
          currentModal.data.id,
          payload
        );
      } else {
        throw new Error("Question modal is not ready");
      }

      setToast({
        msg:
          mode === "add"
            ? "Question created"
            : "Question updated",
        type: "success",
      });

      closeModal();

      await load();
    } catch (error) {
  console.error("Save question failed:", error);

  setToast({
    msg: "Failed to save question",
    type: "error",
  });
}
} //
  async function deleteQuestion(question: QuestionDoc) {
    if (
      !confirm(
        `Delete "${question.text.substring(0, 50)}..." ?`
      )
    )
      return;

    try {
      await softDeleteQuestion(
        question.id,
        question.chapterId
      );

      setToast({
        msg: "Question deleted",
        type: "success",
      });

      await load();
    } catch {
      setToast({
        msg: "Failed to delete question",
        type: "error",
      });
    }
  }

  return {
    chapters,
    questions,
    loading,

    modal,
    toast,

    setToast,

    openAddModal,
    openEditModal,
    closeModal,

    saveQuestion,
    deleteQuestion,
  };
}
