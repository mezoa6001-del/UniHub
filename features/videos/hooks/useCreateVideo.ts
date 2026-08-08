"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";

import { createVideo } from "../services/create-video.service";
import type { CreateVideoInput } from "../schemas/create-video.schema";

export function useCreateVideo() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, profile } = useAuth();

  async function submit(data: CreateVideoInput) {
    setIsLoading(true);
    setError(null);

    try {
      console.group("🎥 Create Video");

      console.log("Current User:", user);
      console.log("Form Data:", data);
if (!user || !profile) {
  throw new Error("User is not authenticated.");
}
const currentUser = {
  uid: user.uid,
  role: profile.role,
};
const video = await createVideo(data, currentUser);

      console.log("Firestore Result:", video);

      console.groupEnd();

      router.push("/admin/videos");
      router.refresh();

      return video;
    } catch (err) {
      console.groupEnd();

      console.error("❌ Failed to create video", err);

      const message =
        err instanceof Error
          ? err.message
          : "Failed to create video.";

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