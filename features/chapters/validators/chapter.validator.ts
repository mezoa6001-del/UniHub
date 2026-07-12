import { z } from "zod";

export const chapterStatusSchema = z.enum([
  "draft",
  "published",
]);

export const createChapterSchema = z.object({
  courseId: z.string().min(1),

  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title is too long"),

  slug: z
    .string()
    .trim()
    .min(3, "Slug must be at least 3 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug may only contain lowercase letters, numbers and hyphens"
    ),

  description: z
    .string()
    .trim()
    .max(500)
    .optional()
    .default(""),

  order: z
    .number()
    .int()
    .min(1),

  status: chapterStatusSchema.default("draft"),
});

export const updateChapterSchema =
  createChapterSchema.partial();

export type CreateChapterInput =
  z.infer<typeof createChapterSchema>;

export type UpdateChapterInput =
  z.infer<typeof updateChapterSchema>;