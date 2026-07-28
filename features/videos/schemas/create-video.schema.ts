import { z } from "zod";

import {
  VIDEO_PROVIDERS,
  VIDEO_STATUSES,
} from "../constants/video.constants";

export const videoProviderSchema = z.enum(VIDEO_PROVIDERS);

export const videoStatusSchema = z.enum(VIDEO_STATUSES);

export const createVideoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title must not exceed 150 characters"),

  description: z
    .string()
    .trim()
    .max(2000)
    .default(""),

  courseId: z.string().min(1, "Course is required"),

  chapterId: z.string().min(1, "Chapter is required"),

  provider: videoProviderSchema,

  videoUrl: z
    .string()
    .trim()
    .url("Invalid video URL"),

  thumbnailUrl: z
    .string()
    .trim()
    .url("Invalid thumbnail URL")
    .optional()
    .or(z.literal("")),

durationSeconds: z
  .number()
  .int()
  .min(0),

  order: z
    .number()
    .int()
    .min(1),

  status: videoStatusSchema,

  isFreePreview: z.boolean(),
});

export type CreateVideoInput =
  z.input<typeof createVideoSchema>;