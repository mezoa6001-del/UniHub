"use client";

import { useState } from "react";

import { Dialog } from "@/components/ui";

import { createLessonSchema } from "../../validators";
import { createLesson } from "../../services";
import { LessonForm } from "../forms/LessonForm";
import type { CreateLessonInput } from "../../validators";
interface CreateLessonDialogProps {
  open: boolean;
  chapterId: string;
  courseId: string;
  onClose: () => void;
  onCreated: () => Promise<void> | void;
}

export function CreateLessonDialog({
  open,
  chapterId,
  courseId,
  onClose,
  onCreated,
}: CreateLessonDialogProps) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
  values: CreateLessonInput
) {
    setLoading(true);

    try {
      const data = createLessonSchema.parse({
        ...values,
        chapterId,
        courseId,
      });

      await createLesson(data);

      await onCreated();

      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      title="Create Lesson"
      description="Add a new lesson to this chapter."
      onClose={onClose}
    >
   <LessonForm
  loading={loading}
  initialValues={{
    courseId,
    chapterId,
    order: 1,
    status: "draft",
  }}
  onSubmit={handleSubmit}
  onCancel={onClose}
/>
    </Dialog>
  );
}