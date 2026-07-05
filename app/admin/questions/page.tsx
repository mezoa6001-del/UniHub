"use client";

import { useMemo, useState } from "react";
import { EmptyState, PrimaryBtn, Spinner, Toast } from "@/components/ui";
import {
  QuestionFilters,
  QuestionModal,
  QuestionStats,
  QuestionTable,
  useQuestionManager,
  type QuestionFiltersState,
} from ".";

const DEFAULT_FILTERS: QuestionFiltersState = {
  search: "",
  chapterId: "",
  difficulty: "all",
};

export default function AdminQuestionsPage() {
  const {
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
  } = useQuestionManager();

  const [filters, setFilters] =
    useState<QuestionFiltersState>(DEFAULT_FILTERS);

  const filteredQuestions = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return questions.filter((question) => {
      const matchesSearch =
        !search ||
        question.text.toLowerCase().includes(search) ||
        (question.explanation ?? "").toLowerCase().includes(search) ||
        question.tags?.some((tag) =>
          tag.toLowerCase().includes(search)
        );

      const matchesChapter =
        !filters.chapterId ||
        question.chapterId === filters.chapterId;

      const matchesDifficulty =
        filters.difficulty === "all" ||
        question.difficulty === filters.difficulty;

      return matchesSearch && matchesChapter && matchesDifficulty;
    });
  }, [filters, questions]);

  return (
    <div className="space-y-5">
      {toast && (
        <Toast
          msg={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-white">
            Question Manager
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Create, edit, filter, and remove question bank items.
          </p>
        </div>
        <PrimaryBtn onClick={openAddModal}>+ Add Question</PrimaryBtn>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size={40} />
        </div>
      ) : questions.length === 0 ? (
        <div className="rounded-2xl border border-white/8 bg-navy-card">
          <EmptyState
            icon="?"
            title="No questions yet"
            desc="Click Add Question to create the first one"
          />
        </div>
      ) : (
        <>
          <QuestionStats
            questions={questions}
            visibleCount={filteredQuestions.length}
          />
          <QuestionFilters
            chapters={chapters}
            filters={filters}
            onChange={setFilters}
          />
          <QuestionTable
            questions={filteredQuestions}
            onEdit={openEditModal}
            onDelete={deleteQuestion}
          />
        </>
      )}

      {modal && (
        <QuestionModal
          mode={modal.mode}
          initial={modal.data}
          chapters={chapters}
          onClose={closeModal}
          onSave={saveQuestion}
        />
      )}
    </div>
  );
}
