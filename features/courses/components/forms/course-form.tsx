"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { PrimaryBtn } from "@/components/ui";
import { useAuth } from "@/features/shared/hooks/use-auth";
import type { CurrentUser } from "@/features/shared/types/auth.types";

import { CourseFormFields } from "./CourseFormFields";

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
    role: "admin",
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
      <CourseFormFields
        register={register}
        errors={errors}
      />

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <PrimaryBtn
          type="submit"
          loading={isLoading}
        >
          Create Course
        </PrimaryBtn>
      </div>
    </form>
  );
}