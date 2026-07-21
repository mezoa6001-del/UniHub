import type { CreateQuestionInput } from "../validators";

export const DEFAULT_QUESTION: CreateQuestionInput = {
  courseId: "",
  chapterId: "",

  title: "",

  explanation: "",

  type: "mcq",

  options: [
    {
      id: crypto.randomUUID(),
      text: "",
      imageUrl: "",
      isCorrect: true,
    },
    {
      id: crypto.randomUUID(),
      text: "",
      imageUrl: "",
      isCorrect: false,
    },
    {
      id: crypto.randomUUID(),
      text: "",
      imageUrl: "",
      isCorrect: false,
    },
    {
      id: crypto.randomUUID(),
      text: "",
      imageUrl: "",
      isCorrect: false,
    },
  ],

  difficulty: "medium",

  tags: [],

  status: "draft",
};