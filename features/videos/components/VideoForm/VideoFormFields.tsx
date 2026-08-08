"use client";

import type {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

import type { Chapter } from "@/features/chapters/types";
import type { Course } from "@/features/courses/types";

interface VideoFormFieldsProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;

  courses: Course[];
  chapters: Chapter[];

  hideCourse?: boolean;
}

export function VideoFormFields<T extends FieldValues>({
  register,
  errors,
  courses,
  chapters,
  hideCourse = false,
}: VideoFormFieldsProps<T>) {
  return (
    <>
      <div>
        <label className="mb-2 block text-sm font-medium">
          Video Title
        </label>

        <input
          {...register("title" as Path<T>)}
          placeholder="Introduction to Pharmacology"
          className="h-11 w-full rounded-lg border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-primary"
        />

        {errors.title && (
          <p className="mt-2 text-sm text-red-500">
            {String(errors.title.message)}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Description
        </label>

        <textarea
          {...register("description" as Path<T>)}
          rows={5}
          className="w-full rounded-lg border border-border bg-background px-3 py-3 outline-none focus:ring-2 focus:ring-primary"
        />

        {errors.description && (
          <p className="mt-2 text-sm text-red-500">
            {String(errors.description.message)}
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {!hideCourse && (
  <div>
    <label className="mb-2 block text-sm font-medium">
      Course
    </label>

    <select
      {...register("courseId" as Path<T>)}
      className="h-11 w-full rounded-lg border border-border bg-background px-3"
    >
      <option value="">Select Course</option>

      {courses.map((course) => (
        <option
          key={course.id}
          value={course.id}
        >
          {course.title}
        </option>
      ))}
    </select>
  </div>
)}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Chapter
          </label>

          <select
            {...register("chapterId" as Path<T>)}
            className="h-11 w-full rounded-lg border border-border bg-background px-3"
          >
            <option value="">Select Chapter</option>

            {chapters.map((chapter) => (
              <option
                key={chapter.id}
                value={chapter.id}
              >
                {chapter.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Provider
          </label>

          <select
            {...register("provider" as Path<T>)}
            className="h-11 w-full rounded-lg border border-border bg-background px-3"
          >
            <option value="youtube">YouTube</option>
            <option value="storage">Storage</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Status
          </label>

          <select
            {...register("status" as Path<T>)}
            className="h-11 w-full rounded-lg border border-border bg-background px-3"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Video URL
        </label>

        <input
          type="url"
          {...register("videoUrl" as Path<T>)}
          className="h-11 w-full rounded-lg border border-border bg-background px-3"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Thumbnail URL
        </label>

        <input
          type="url"
          {...register("thumbnailUrl" as Path<T>)}
          className="h-11 w-full rounded-lg border border-border bg-background px-3"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          type="number"
          placeholder="Duration"
          {...register("durationSeconds" as Path<T>, {
            valueAsNumber: true,
          })}
          className="h-11 rounded-lg border border-border px-3"
        />

        <input
          type="number"
          placeholder="Order"
          {...register("order" as Path<T>, {
            valueAsNumber: true,
          })}
          className="h-11 rounded-lg border border-border px-3"
        />
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          {...register("isFreePreview" as Path<T>)}
        />

        Free Preview
      </label>
    </>
  );
}