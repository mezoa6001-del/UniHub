import type { ChapterDoc, Difficulty, QuestionDoc } from "@/types";

export type QuestionForm = {
  chapterId: string;
  chapterName: string;
  text: string;
  explanation: string;
  difficulty: Difficulty;
  type: "single";
  options: Array<{ id: string; text: string }>;
  correctAnswer: string;
  references: string[];
  tags: string[];
  source?: string;
  year?: number;
};

export const BLANK_QUESTION: QuestionForm = {
  chapterId: "",
  chapterName: "",
  text: "",
  explanation: "",
  difficulty: "medium" as const,
  type: "single",
  options: [
    { id: "a", text: "" },
    { id: "b", text: "" },
    { id: "c", text: "" },
    { id: "d", text: "" },
  ],
  correctAnswer: "a",
  references: [] as string[],
  tags: [] as string[],
};

export function createBlankQuestion(): QuestionForm {
  return {
    ...BLANK_QUESTION,
    options: BLANK_QUESTION.options.map((option) => ({ ...option })),
    references: [],
    tags: [],
  };
}

export type QuestionModalState = {
  mode: "add" | "edit";
  data: QuestionDoc | QuestionForm;
};

export type QuestionManagerState = {
  chapters: ChapterDoc[];
  questions: QuestionDoc[];
  loading: boolean;
  modal: QuestionModalState | null;
};

export type QuestionFilters = {
  search: string;
  chapterId: string;
  difficulty: "all" | Difficulty;
};
