"use client";

import { useAuth } from "@/features/shared/hooks/use-auth";
import type { CurrentUser } from "@/features/shared/types/auth.types";

import { ConfirmDialog } from "@/components/ui";

import { useDeleteCourse } from "../../hooks/use-delete-course";
import type { Course } from "../../types";

interface DeleteCourseDialogProps {
  open: boolean;
  course: Course | null;
  onClose: () => void;
  onDeleted: () => Promise<void>;
}

export function DeleteCourseDialog({
  open,
  course,
  onClose,
  onDeleted,
}: DeleteCourseDialogProps) {
  const { user } = useAuth();

  const currentUser: CurrentUser = {
    uid: user?.uid ?? "",
    role: "owner",
  };

  const { submit, loading } =
    useDeleteCourse(currentUser);

  async function handleDelete() {
    if (!course) return;

    const ok = await submit(course.id);

    if (!ok) return;

    await onDeleted();
    onClose();
  }

  return (
    <ConfirmDialog
      open={open}
      title="Delete Course"
      description={
        course
          ? `Are you sure you want to delete "${course.title}"?`
          : ""
      }
      confirmLabel="Delete"
      cancelLabel="Cancel"
      danger
      loading={loading}
      onCancel={onClose}
      onConfirm={handleDelete}
    />
  );
}