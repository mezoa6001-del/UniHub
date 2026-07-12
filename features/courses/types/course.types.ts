import type { Timestamp } from "firebase/firestore";

export type CourseStatus = "draft" | "published";

export interface Course {
  id: string;

  title: string;
  slug: string;
  description: string;

  thumbnailUrl: string;

  ownerId: string;
  instructorIds: string[];

  status: CourseStatus;

  createdBy: string;
  updatedBy: string;

  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  deletedAt: Timestamp | null;
}

export interface CreateCourseResponse {
  id: string;
  slug: string;
}

export interface CourseFilters {
  search?: string;
  status?: CourseStatus | "all";
}

export interface CourseStatistics {
  chapters: number;
  videos: number;
  questions: number;
  flashcards: number;
}