import type { Timestamp } from "firebase/firestore";

export type ChapterStatus =
  | "draft"
  | "published";

export interface Chapter {
  id: string;

  courseId: string;

  title: string;

  slug: string;

  description: string;

  order: number;

  status: ChapterStatus;

  createdAt: Timestamp;

  updatedAt: Timestamp;
}