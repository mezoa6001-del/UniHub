"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { PrimaryBtn } from "@/components/ui";
import { useAuth } from "@/features/shared/hooks/use-auth";
import type { CurrentUser } from "@/features/shared/types/auth.types";

import { useCreateCourse } from "../../hooks/use-create-course";
import { generateSlug } from "../../utils/generate-slug";
import {
  createCourseSchema,
  type CreateCourseInput,
} from "../../validators/create-course.schema";

export function CourseForm() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-8 text-center text-sm text-red-500">
        Please sign in first.
      </div>
    );
  }

  const currentUser: CurrentUser = {
    uid: user.uid,
    role: "owner",
  };

  return <CourseFormContent currentUser={currentUser} />;
}

interface CourseFormContentProps {
  currentUser: CurrentUser;
}

function CourseFormContent({
  currentUser,
}: CourseFormContentProps) {
  const { submit, isLoading, error } =
    useCreateCourse(currentUser);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateCourseInput>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      thumbnailUrl: undefined,
      instructorIds: [],
      status: "draft",
    },
  });

  const title = watch("title");

  useEffect(() => {
    setValue("slug", generateSlug(title), {
      shouldValidate: true,
    });
  }, [title, setValue]);

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="space-y-8"
    >
      <div>
        <label className="mb-2 block text-sm font-medium">
          Course Title
        </label>

        <input
          {...register("title")}
          placeholder="Pharmacology Foundation"
          className="h-11 w-full rounded-lg border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-primary"
        />

        {errors.title && (
          <p className="mt-2 text-sm text-red-500">
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Slug
        </label>

        <input
          {...register("slug")}
          className="h-11 w-full rounded-lg border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-primary"
        />

        <p className="mt-2 text-xs text-muted-foreground">
          Generated automatically from the course title.
        </p>

        {errors.slug && (
          <p className="mt-2 text-sm text-red-500">
            {errors.slug.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Description
        </label>

        <textarea
          {...register("description")}
          rows={7}
          placeholder="Write a short description..."
          className="w-full rounded-lg border border-border bg-background px-3 py-3 outline-none focus:ring-2 focus:ring-primary"
        />

        {errors.description && (
          <p className="mt-2 text-sm text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <PrimaryBtn
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Course"}
        </PrimaryBtn>
      </div>
    </form>
  );
}