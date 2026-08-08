"use client";

import { Dialog } from "@/components/ui/dialogs";
import { VideoForm } from "../VideoForm";
import { useCreateVideo } from "../../hooks/useCreateVideo";

type AddVideoModalProps = {
  open: boolean;
  onClose: () => void;
  courseId?: string;
  onSaved?: () => void | Promise<void>;
};

export function AddVideoModal({
  open,
  onClose,
  courseId,
  onSaved,
}: AddVideoModalProps) {
  const { submit, isLoading, error } =
    useCreateVideo();

  const initialValues = courseId
    ? {
        courseId,
      }
    : undefined;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Add Video"
      description="Create a new lesson for this course."
    >
      <VideoForm
        initialValues={initialValues}
        onSubmit={async (data) => {
          await submit(data);
          await onSaved?.();
          onClose();
        }}
        isLoading={isLoading}
        error={error}
        submitLabel="Create Video"
      />
    </Dialog>
  );
}
