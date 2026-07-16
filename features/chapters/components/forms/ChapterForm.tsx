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

import type { CreateChapterInput } from "../../validators";

interface ChapterFormProps {
  loading?: boolean;
  initialValues?: Partial<CreateChapterInput>;
  submitLabel?: string;
  onSubmit: (
    values: CreateChapterInput
  ) => Promise<void> | void;
  onCancel: () => void;
}

export function ChapterForm({
  loading = false,
  initialValues,
  submitLabel = "Save Chapter",
  onSubmit,
  onCancel,
}: ChapterFormProps) {
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
          placeholder="Chapter title"
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
          placeholder="chapter-slug"
          onChange={(
            e: ChangeEvent<HTMLInputElement>
          ) => setSlug(e.target.value)}
        />
      </FormField>

      <FormField label="Description">
        <Textarea
          rows={4}
          value={description}
          placeholder="Chapter description..."
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