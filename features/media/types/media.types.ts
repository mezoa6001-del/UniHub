export type MediaFolder =
  | "courses"
  | "chapters"
  | "questions"
  | "users"
  | "ai";

export interface UploadedMedia {
  name: string;
  url: string;
  path: string;
  size: number;
  type: string;
}