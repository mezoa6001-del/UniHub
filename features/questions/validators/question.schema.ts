import { z } from "zod";

export const questionTypeSchema = z.enum([
  "mcq",
  "true_false",
  "essay",
]);

export const difficultySchema = z.enum([
  "easy",
  "medium",
  "hard",
]);

export const questionStatusSchema = z.enum([
  "draft",
  "published",
]);

export const questionOptionSchema = z.object({
  id: z.string(),

  text: z
    .string()
    .trim()
    .min(1, "Option text is required."),

  imageUrl: z.string().optional(),

  isCorrect: z.boolean(),
});

export const createQuestionSchema = z.object({
  courseId: z.string().min(1),
  chapterId: z.string().min(1),

title: z
  .string()
  .trim()
  .min(10, "Question must be at least 10 characters.")
  .max(1000),

imageUrl: z.string().optional(),

explanation: z.string().trim().optional(),

explanationImageUrl: z.string().optional(),

type: questionTypeSchema,

options: z
  .array(questionOptionSchema)
  .min(2, "At least two options are required."),

difficulty: difficultySchema,

tags: z.array(z.string()).default([]),

status: questionStatusSchema,
});

export const updateQuestionSchema =
  createQuestionSchema.partial();

export type CreateQuestionInput =
  z.infer<typeof createQuestionSchema>;

export type UpdateQuestionInput =
  z.infer<typeof updateQuestionSchema>;
  