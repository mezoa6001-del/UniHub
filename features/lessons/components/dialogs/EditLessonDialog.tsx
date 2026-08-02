"use client";

import { useState } from "react";

import { Dialog } from "@/components/ui";

import { updateLesson } from "../../services";

import type { Lesson } from "../../types";
import type { CreateLessonInput } from "../../validators";

import { LessonForm } from "../forms/LessonForm";

interface EditLessonDialogProps {
  open: boolean;
  lesson: Lesson | null;
  onClose: () => void;
  onUpdated: () => Promise<void> | void;
}

export function EditLessonDialog({
  open,
  lesson,
  onClose,
  onUpdated,
}: EditLessonDialogProps) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    values: CreateLessonInput
  ) {
    if (!lesson) return;

    try {
      setLoading(true);

      await updateLesson(lesson.id, values);

      await onUpdated();

      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (!lesson) {
    return null;
  }

  return (
    <Dialog
      open={open}
      title="Edit Lesson"
      description="Update lesson information."
      onClose={onClose}
    >
      <LessonForm
        loading={loading}
        initialValues={{
          courseId: lesson.courseId,
          chapterId: lesson.chapterId,
          title: lesson.title,
          slug: lesson.slug,
          description: lesson.description,
          order: lesson.order,
          status: lesson.status,
        }}
        submitLabel="Save Changes"
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Dialog>
  );
}