import type {
  Difficulty,
  QuestionStatus,
  QuestionType,
} from "./question.types";

export interface QuestionFormOption {
  id: string;
  text: string;
  imageUrl: string;
  isCorrect: boolean;
}

export interface QuestionFormValues {
  courseId: string;

  chapterId: string;

  title: string;

  imageUrl: string;

  explanation: string;

  explanationImageUrl: string;

  type: QuestionType;

  options: QuestionFormOption[];

  difficulty: Difficulty;

  tags: string[];

  status: QuestionStatus;
}