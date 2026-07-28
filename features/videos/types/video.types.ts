import type { Timestamp } from "firebase/firestore";

export type VideoProvider = "youtube" | "storage";

export type VideoStatus = "draft" | "published";

export interface Video {
  id: string;

  title: string;
  description: string;

  courseId: string;
  chapterId: string;

  provider: VideoProvider;
  videoUrl: string;

  thumbnailUrl?: string;

  durationSeconds: number;
  order: number;

  status: VideoStatus;
  isFreePreview: boolean;

  createdBy: string;
  updatedBy: string;

  createdAt: Timestamp;
  updatedAt: Timestamp;

  deletedAt: Timestamp | null;
}

export interface CreateVideoData {
  title: string;
  description: string;

  courseId: string;
  chapterId: string;

  provider: VideoProvider;
  videoUrl: string;

  thumbnailUrl?: string;

  durationSeconds: number;
  order: number;

  status: VideoStatus;
  isFreePreview: boolean;
}

export interface UpdateVideoData
  extends Partial<CreateVideoData> {}