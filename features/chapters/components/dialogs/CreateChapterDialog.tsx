"use client";

import { useState } from "react";

import { Dialog } from "@/components/ui";

import { createChapterSchema } from "../../validators";
import { createChapter } from "../../services";
import { ChapterForm } from "../forms/ChapterForm";

interface CreateChapterDialogProps {
  open: boolean;
  courseId: string;
  onClose: () => void;
  onCreated: () => Promise<void> | void;
}

export function CreateChapterDialog({
  open,
  courseId,
  onClose,
  onCreated,
}: CreateChapterDialogProps) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(values: {
    title: string;
    slug: string;
    description: string;
    order: number;
    status: "draft" | "published";
  }) {
    setLoading(true);

    try {
      const data = createChapterSchema.parse({
        ...values,
        courseId,
      });

      await createChapter(data);

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
      title="Create Chapter"
      description="Add a new chapter to this course."
      onClose={onClose}
    >
      <ChapterForm
        loading={loading}
        initialValues={{
          courseId,
          order: 1,
          status: "draft",
        }}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Dialog>
  );
}