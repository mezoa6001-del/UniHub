import { z } from "zod";

export const courseStatusSchema = z.enum([
  "draft",
  "published",
  "archived",
]);

export const createCourseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title must not exceed 150 characters"),

  slug: z
    .string()
    .trim()
    .min(3)
    .max(150),

  description: z
    .string()
    .trim()
    .min(10)
    .max(5000),

  thumbnailUrl: z
    .string()
    .url()
    .optional(),

  instructorIds: z.array(z.string()),

  status: courseStatusSchema.default("draft"),
});
export type CreateCourseInput = z.input<typeof createCourseSchema>;