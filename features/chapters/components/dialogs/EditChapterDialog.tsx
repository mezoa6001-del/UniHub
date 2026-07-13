"use client";

import { useState } from "react";

import { Dialog } from "@/components/ui";

import {
  updateChapter,
} from "../../services";

import type { Chapter } from "../../types";
import type { CreateChapterInput } from "../../validators";

import { ChapterForm } from "../forms/ChapterForm";

interface EditChapterDialogProps {
  open: boolean;
  chapter: Chapter | null;
  onClose: () => void;
  onUpdated: () => Promise<void> | void;
}

export function EditChapterDialog({
  open,
  chapter,
  onClose,
  onUpdated,
}: EditChapterDialogProps) {
  const [loading, setLoading] =
    useState(false);

  if (!chapter) return null;

  async function handleSubmit(
    values: CreateChapterInput
  ) {
    try {
      setLoading(true);

      if (!chapter) return;

await updateChapter(
  chapter.id,
  values
);

      await onUpdated();

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
      title="Edit Chapter"
      description="Update chapter information."
      onClose={onClose}
    >
      <ChapterForm
        loading={loading}
        initialValues={{
          courseId: chapter.courseId,
          title: chapter.title,
          slug: chapter.slug,
          description:
            chapter.description,
          order: chapter.order,
          status: chapter.status,
        }}
        submitLabel="Save Changes"
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Dialog>
  );
}