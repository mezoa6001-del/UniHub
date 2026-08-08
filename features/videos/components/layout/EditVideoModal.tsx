"use client";

import { Dialog } from "@/components/ui/dialogs";

import { VideoForm } from "../VideoForm";

import { useUpdateVideo } from "../../hooks/useUpdateVideo";

import type { Video } from "../../types/video.types";

type EditVideoModalProps = {
  open: boolean;
  onClose: () => void;
  video: Video;
  onSaved?: () => void | Promise<void>;
};

export function EditVideoModal({
  open,
  onClose,
  video,
  onSaved,
}: EditVideoModalProps) {
  const { submit, isLoading, error } =
    useUpdateVideo();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Edit Video"
      description="Update video information."
    >
      <VideoForm
        initialValues={video}
        onSubmit={async (data) => {
          await submit(video.id, data);
          await onSaved?.();
          onClose();
        }}
        isLoading={isLoading}
        error={error}
        submitLabel="Update Video"
      />
    </Dialog>
  );
}
