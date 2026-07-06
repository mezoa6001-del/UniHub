import type { ChapterDoc, VideoDoc } from "@/types";

export const BLANK_VIDEO: Partial<VideoDoc> = {
  title: "",
  description: "",
  chapterId: "",
  chapterName: "",
  instructorName: "",
  provider: "bunny",
  bunnyVideoId: "",
  videoUrl: "",
  thumbnailUrl: "",
  duration: 0,
  order: 0,
  isPublished: false,
};

export type VideoModalState = {
  mode: "add" | "edit";
  data: Partial<VideoDoc>;
} | null;

export type VideoManagerState = {
  videos: VideoDoc[];
  chapters: ChapterDoc[];
  loading: boolean;
  modal: VideoModalState;
};

export type VideoFilters = {
  search: string;
  chapterId: string;
  published: "all" | "published" | "draft";
};