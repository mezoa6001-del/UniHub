"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { z } from "zod";

import { FormActions } from "@/components/ui/forms";
import { MediaUploader } from "@/features/media/components";
import { useChapters } from "@/features/chapters/hooks/use-chapters";

import { OptionField } from "./OptionField";

const optionSchema = z.object({
  id: z.string().optional(),
  text: z.string().trim().min(1, "Option text is required."),
  isCorrect: z.boolean(),
});

const questionFormSchema = z
  .object({
    courseId: z.string().min(1, "Course is required."),
    chapterId: z.string().min(1, "Chapter is required."),
    title: z.string().trim().min(3, "Question title must be at least 3 characters."),
    explanation: z.string().trim().min(3, "Explanation must be at least 3 characters."),
    difficulty: z.enum(["easy", "medium", "hard"]),
    status: z.enum(["draft", "published"]),
    tags: z.array(z.string().trim().min(1)).max(10),
    questionImageUrl: z.string().url().nullable(),
    explanationImageUrl: z.string().url().nullable(),
    options: z.array(optionSchema).min(2, "Add at least two options."),
  })
  .superRefine((values, context) => {
    const correctOptions = values.options.filter((option) => option.isCorrect);

    if (correctOptions.length !== 1) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["options"],
        message: "Select exactly one correct option.",
      });
    }
  });

export type QuestionFormValues = z.infer<typeof questionFormSchema>;

type Course = {
  id: string;
  title: string;
};

type QuestionFormProps = {
  mode: "create" | "edit";
  courses: Course[];
  defaultValues?: Partial<QuestionFormValues>;
  isSubmitting?: boolean;
  onCancel?: () => void;
  onSubmit: (values: QuestionFormValues) => Promise<void> | void;
};

const createDefaultValues = (
  values?: Partial<QuestionFormValues>,
): QuestionFormValues => ({
  courseId: values?.courseId ?? "",
  chapterId: values?.chapterId ?? "",
  title: values?.title ?? "",
  explanation: values?.explanation ?? "",
  difficulty: values?.difficulty ?? "medium",
  status: values?.status ?? "draft",
  tags: values?.tags ?? [],
  questionImageUrl: values?.questionImageUrl ?? null,
  explanationImageUrl: values?.explanationImageUrl ?? null,
  options:
    values?.options?.length && values.options.length >= 2
      ? values.options
      : [
          { text: "", isCorrect: true },
          { text: "", isCorrect: false },
        ],
});

export function QuestionForm({
  mode,
  courses,
  defaultValues,
  isSubmitting = false,
  onCancel,
  onSubmit,
}: QuestionFormProps) {
  const methods = useForm<QuestionFormValues>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: createDefaultValues(defaultValues),
    mode: "onBlur",
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
  } = methods;

  const courseId = useWatch({
    control,
    name: "courseId",
  });

  const selectedTags = useWatch({
    control,
    name: "tags",
  });

  const { chapters, loading: isChaptersLoading } = useChapters(courseId);

  const { append, fields, remove } = useFieldArray({
    control,
    name: "options",
  });

  useEffect(() => {
    reset(createDefaultValues(defaultValues));
  }, [defaultValues, reset]);

  const chapterOptions = useMemo(
    () =>
      chapters?.map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
      })) ?? [],
    [chapters],
  );

  const handleCourseChange = (courseId: string) => {
    setValue("courseId", courseId, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setValue("chapterId", "", {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleTagsChange = (value: string) => {
    const tags = value
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean)
      .filter((tag, index, array) => array.indexOf(tag) === index)
      .slice(0, 10);

    setValue("tags", tags, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleFormSubmit = async (values: QuestionFormValues) => {
    await onSubmit({
      ...values,
      title: values.title.trim(),
      explanation: values.explanation.trim(),
      tags: values.tags.map((tag) => tag.trim()).filter(Boolean),
      options: values.options.map((option) => ({
        ...option,
        text: option.text.trim(),
      })),
    });
  };

  return (
    <FormProvider {...methods}>
      <form
        className="space-y-8"
        noValidate
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <section className="grid gap-6 rounded-xl border border-border bg-card p-6 md:grid-cols-2">
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="courseId"
            >
              Course
            </label>
            <select
              id="courseId"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
              disabled={isSubmitting}
              {...register("courseId", {
                onChange: (event) => handleCourseChange(event.target.value),
              })}
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
            {errors.courseId && (
              <p className="text-sm text-destructive">
                {errors.courseId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="chapterId"
            >
              Chapter
            </label>
            <select
              id="chapterId"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!courseId || isChaptersLoading || isSubmitting}
              {...register("chapterId")}
            >
              <option value="">
                {isChaptersLoading ? "Loading chapters..." : "Select a chapter"}
              </option>
              {chapterOptions.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.title}
                </option>
              ))}
            </select>
            {errors.chapterId && (
              <p className="text-sm text-destructive">
                {errors.chapterId.message}
              </p>
            )}
          </div>
        </section>

        <section className="space-y-6 rounded-xl border border-border bg-card p-6">
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="title"
            >
              Question title
            </label>
            <textarea
              id="title"
              rows={4}
              className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
              disabled={isSubmitting}
              placeholder="Enter the question text"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <Controller
            control={control}
            name="questionImageUrl"
            render={({ field }) => (
              <MediaUploader
                folder="questions"
                value={field.value ?? undefined}
                onChange={field.onChange}
              />
            )}
          />
        </section>

        <section className="space-y-4 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold text-foreground">Options</h2>
              <p className="text-sm text-muted-foreground">
                Add the available answers and select one correct option.
              </p>
            </div>

            <button
              type="button"
              className="rounded-md border border-input px-3 py-2 text-sm font-medium transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isSubmitting}
              onClick={() => append({ text: "", isCorrect: false })}
            >
              Add option
            </button>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <OptionField
                key={field.id}
                index={index}
                canRemove={fields.length > 2}
                disabled={isSubmitting}
                onRemove={() => remove(index)}
              />
            ))}
          </div>

          {errors.options?.message && (
            <p className="text-sm text-destructive">{errors.options.message}</p>
          )}
        </section>

        <section className="grid gap-6 rounded-xl border border-border bg-card p-6 md:grid-cols-2">
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="difficulty"
            >
              Difficulty
            </label>
            <select
              id="difficulty"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
              disabled={isSubmitting}
              {...register("difficulty")}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="status"
            >
              Status
            </label>
            <select
              id="status"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
              disabled={isSubmitting}
              {...register("status")}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="tags"
            >
              Tags
            </label>
            <input
              id="tags"
              type="text"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
              disabled={isSubmitting}
              placeholder="pharmacology, antibiotics, exam"
              value={selectedTags.join(", ")}
              onChange={(event) => handleTagsChange(event.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Separate tags with commas. Maximum 10 tags.
            </p>
            {errors.tags && (
              <p className="text-sm text-destructive">{errors.tags.message}</p>
            )}
          </div>
        </section>

        <section className="space-y-6 rounded-xl border border-border bg-card p-6">
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="explanation"
            >
              Explanation
            </label>
            <textarea
              id="explanation"
              rows={5}
              className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
              disabled={isSubmitting}
              placeholder="Explain why the correct option is correct."
              {...register("explanation")}
            />
            {errors.explanation && (
              <p className="text-sm text-destructive">
                {errors.explanation.message}
              </p>
            )}
          </div>

          <Controller
            control={control}
            name="explanationImageUrl"
            render={({ field }) => (
              <MediaUploader
                folder="questions"
                value={field.value ?? undefined}
                onChange={field.onChange}
              />
            )}
          />
        </section>

        <FormActions
          cancelLabel="Cancel"
          loading={isSubmitting}
          submitLabel={mode === "create" ? "Create question" : "Save changes"}
          onCancel={onCancel}
        />
      </form>
    </FormProvider>
  );
}