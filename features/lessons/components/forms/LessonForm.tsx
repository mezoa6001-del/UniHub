"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import {
  FormActions,
  FormField,
  Input,
  Select,
  Textarea,
} from "@/components/ui";

import type { CreateLessonInput } from "../../validators";

interface LessonFormProps {
  loading?: boolean;
  initialValues?: Partial<CreateLessonInput>;
  submitLabel?: string;
  onSubmit: (
    values: CreateLessonInput
  ) => Promise<void> | void;
  onCancel: () => void;
}

export function LessonForm({
  loading = false,
  initialValues,
  submitLabel = "Save Lesson",
  onSubmit,
  onCancel,
}: LessonFormProps) {
  const [title, setTitle] = useState(
    initialValues?.title ?? ""
  );

  const [slug, setSlug] = useState(
    initialValues?.slug ?? ""
  );

  const [description, setDescription] = useState(
    initialValues?.description ?? ""
  );

  const [order, setOrder] = useState(
    initialValues?.order ?? 1
  );

  const [status, setStatus] = useState<"draft" | "published">(
    initialValues?.status ?? "draft"
  );

  useEffect(() => {
    setTitle(initialValues?.title ?? "");
    setSlug(initialValues?.slug ?? "");
    setDescription(initialValues?.description ?? "");
    setOrder(initialValues?.order ?? 1);
    setStatus(initialValues?.status ?? "draft");
  }, [initialValues]);

  useEffect(() => {
    if (slug.trim() !== "") return;

    setSlug(
      title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
    );
  }, [title, slug]);

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const finalSlug =
      slug.trim() ||
      title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

    await onSubmit({
      courseId: initialValues?.courseId ?? "",
      chapterId: initialValues?.chapterId ?? "",
      title,
      slug: finalSlug,
      description,
      order,
      status,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <FormField
        label="Title"
        required
      >
        <Input
          value={title}
          placeholder="Lesson title"
          onChange={(
            e: ChangeEvent<HTMLInputElement>
          ) => setTitle(e.target.value)}
        />
      </FormField>

      <FormField
        label="Slug"
        required
      >
        <Input
          value={slug}
          placeholder="lesson-slug"
          onChange={(
            e: ChangeEvent<HTMLInputElement>
          ) => setSlug(e.target.value)}
        />
      </FormField>

      <FormField label="Description">
        <Textarea
          rows={4}
          value={description}
          placeholder="Lesson description..."
          onChange={(
            e: ChangeEvent<HTMLTextAreaElement>
          ) => setDescription(e.target.value)}
        />
      </FormField>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField label="Order">
          <Input
            type="number"
            min={1}
            value={order}
            onChange={(
              e: ChangeEvent<HTMLInputElement>
            ) =>
              setOrder(
                Number(e.target.value) || 1
              )
            }
          />
        </FormField>

        <FormField label="Status">
          <Select
            value={status}
            onChange={(
              e: ChangeEvent<HTMLSelectElement>
            ) =>
              setStatus(
                e.target.value as
                  | "draft"
                  | "published"
              )
            }
          >
            <option value="draft">
              Draft
            </option>

            <option value="published">
              Published
            </option>
          </Select>
        </FormField>
      </div>

      <FormActions
        loading={loading}
        submitLabel={submitLabel}
        onCancel={onCancel}
      />
    </form>
  );
}