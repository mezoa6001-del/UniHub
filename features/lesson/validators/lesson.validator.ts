import { z } from "zod";

export const lessonStatusSchema = z.enum([
  "draft",
  "published",
]);

export const createLessonSchema = z.object({
  courseId: z.string().min(1),

  chapterId: z.string().min(1),

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
    .default(""),

  order: z.coerce.number().int().min(1),

  status: lessonStatusSchema.default("draft"),
});

export const updateLessonSchema = createLessonSchema.partial();

/**
 * Types used by React Hook Form (input)
 */
export type CreateLessonInput = z.input<typeof createLessonSchema>;
export type UpdateLessonInput = z.input<typeof updateLessonSchema>;

/**
 * Types after validation (output)
 */
export type CreateLessonOutput = z.output<typeof createLessonSchema>;
export type UpdateLessonOutput = z.output<typeof updateLessonSchema>;