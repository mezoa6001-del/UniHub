export type QuestionType = "mcq" | "true_false" | "essay";

export type Difficulty = "easy" | "medium" | "hard";

export type QuestionStatus = "draft" | "published";

export interface QuestionOption {
  id: string;
  text: string;
  imageUrl?: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;

  courseId: string;
  chapterId: string;

  title: string;

  // صورة السؤال
  imageUrl?: string;

  explanation?: string;

  // صورة الشرح
  explanationImageUrl?: string;

  type: QuestionType;

  options: QuestionOption[];

  difficulty: Difficulty;

  tags: string[];

  status: QuestionStatus;

  createdBy: string;
  updatedBy: string;

  createdAt: unknown;
  updatedAt: unknown;
}