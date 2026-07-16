"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Dialog, PrimaryBtn } from "@/components/ui";
import { useAuth } from "@/features/shared/hooks/use-auth";
import type { CurrentUser } from "@/features/shared/types/auth.types";

import { CourseFormFields } from "../forms/CourseFormFields";

import { useUpdateCourse } from "../../hooks/use-update-course";
import type { Course } from "../../types";
import {
  updateCourseSchema,
  type UpdateCourseInput,
} from "../../validators/update-course.schema";

interface EditCourseDialogProps {
  open: boolean;
  course: Course | null;
  onClose: () => void;
  onUpdated: () => Promise<void>;
}

export function EditCourseDialog({
  open,
  course,
  onClose,
  onUpdated,
}: EditCourseDialogProps) {
  const { user } = useAuth();

  const currentUser: CurrentUser = {
  uid: user?.uid ?? "",
  role: "owner",
};

  

  const { submit, loading, error } =
    useUpdateCourse(currentUser);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateCourseInput>({
    resolver: zodResolver(updateCourseSchema),
    defaultValues: {
  title: course?.title ?? "",
  slug: course?.slug ?? "",
  description: course?.description ?? "",
  status: course?.status ?? "draft",
},
  });

  useEffect(() => {
    if (!course) return;

reset({
  title: course.title,
  slug: course.slug,
  description: course.description,
  status: course.status,
});
  }, [course, reset]);
    async function onSubmit(data: UpdateCourseInput) {
 if (!course || !user) return null;

  const ok = await submit(course.id, data);

  if (!ok) return;

  await onUpdated();
  onClose();
}

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Edit Course"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <CourseFormFields<UpdateCourseInput>
          register={register}
          errors={errors}
        />

        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <PrimaryBtn
            type="button"
            onClick={onClose}
          >
            Cancel
          </PrimaryBtn>

          <PrimaryBtn
            type="submit"
            loading={loading}
          >
            Save Changes
          </PrimaryBtn>
        </div>
      </form>
    </Dialog>
  );
}