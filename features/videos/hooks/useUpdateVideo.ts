"use client";

import { useState } from "react";

import { useAuth } from "@/features/shared/hooks/use-auth";
import type { CurrentUser } from "@/features/shared/types/auth.types";

import type { UpdateVideoInput } from "../schemas/update-video.schema";
import { updateVideo } from "../services/update-video.service";

export function useUpdateVideo() {
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(
    videoId: string,
    data: UpdateVideoInput
  ) {
    if (!user) {
      throw new Error("User not authenticated.");
    }

    const currentUser: CurrentUser = {
      uid: user.uid,
      role: "admin",
    };

    setIsLoading(true);
    setError(null);

    try {
      await updateVideo(
        videoId,
        data,
        currentUser
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to update video.";

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