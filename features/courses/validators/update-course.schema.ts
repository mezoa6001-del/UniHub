import { z } from "zod";
import { courseStatusSchema } from "./create-course.schema";

export const updateCourseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title must not exceed 150 characters")
    .optional(),

  slug: z
    .string()
    .trim()
    .min(3)
    .max(150)
    .optional(),

  description: z
    .string()
    .trim()
    .min(10)
    .max(5000)
    .optional(),

  thumbnailUrl: z
    .string()
    .url()
    .optional(),

  instructorIds: z
    .array(z.string())
    .optional(),

  status: courseStatusSchema.optional(),
});