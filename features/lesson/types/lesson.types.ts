import type { Timestamp } from "firebase/firestore";

export type LessonStatus = "draft" | "published";

export interface Lesson {
  id: string;

  courseId: string;

  chapterId: string;

  title: string;

  slug: string;

  description: string;

  order: number;

  status: LessonStatus;

  createdAt: Timestamp;

  updatedAt: Timestamp;
}