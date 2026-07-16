"use client";

import type {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

interface CourseFormFieldsProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

export function CourseFormFields<T extends FieldValues>({
  register,
  errors,
}: CourseFormFieldsProps<T>) {
  return (
    <>
      <div>
        <label className="mb-2 block text-sm font-medium">
          Course Title
        </label>

        <input
          {...register("title" as Path<T>)}
          placeholder="Pharmacology Foundation"
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
          Slug
        </label>

        <input
          {...register("slug" as Path<T>)}
          className="h-11 w-full rounded-lg border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-primary"
        />

        <p className="mt-2 text-xs text-muted-foreground">
          Generated automatically from the course title.
        </p>

        {errors.slug && (
          <p className="mt-2 text-sm text-red-500">
            {String(errors.slug.message)}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Description
        </label>

        <textarea
          {...register("description" as Path<T>)}
          rows={7}
          placeholder="Write a short description..."
          className="w-full rounded-lg border border-border bg-background px-3 py-3 outline-none focus:ring-2 focus:ring-primary"
        />

        {errors.description && (
          <p className="mt-2 text-sm text-red-500">
            {String(errors.description.message)}
          </p>
        )}
      </div>
    </>
  );
}