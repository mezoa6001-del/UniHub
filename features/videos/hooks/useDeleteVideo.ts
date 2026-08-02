"use client";

import { useState } from "react";

import { deleteVideo } from "../services/delete-video.service";

export function useDeleteVideo() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(videoId: string) {
    setIsLoading(true);
    setError(null);

    try {
      return await deleteVideo(videoId);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to delete video.";

      setError(message);

      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    submit,
    isLoading,
    error,
  };
}