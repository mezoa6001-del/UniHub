"use client";

import { useState } from "react";

import { ConfirmDialog } from "@/components/ui";

import { deleteLesson } from "../../services";
import type { Lesson } from "../../types";

interface DeleteLessonDialogProps {
  open: boolean;
  lesson: Lesson | null;
  onClose: () => void;
  onDeleted: () => Promise<void> | void;
}

export function DeleteLessonDialog({
  open,
  lesson,
  onClose,
  onDeleted,
}: DeleteLessonDialogProps) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!lesson) return;

    try {
      setLoading(true);

      await deleteLesson(lesson.id);

      await onDeleted();

      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ConfirmDialog
      open={open}
      title="Delete Lesson"
      description={`Are you sure you want to delete "${lesson?.title}"? This action cannot be undone.`}
      confirmLabel="Delete"
      cancelLabel="Cancel"
      loading={loading}
      danger
      onConfirm={handleDelete}
      onCancel={onClose}
    />
  );
}