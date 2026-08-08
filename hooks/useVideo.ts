"use client";

import { useEffect, useState } from "react";

import { getVideoById } from "@/lib/firebase/firestore";
import type { VideoDoc } from "@/types";

type UseVideoResult = {
  video: VideoDoc | null;
  loading: boolean;
  error: Error | null;
};

export function useVideo(
  videoId: string
): UseVideoResult {
  const [video, setVideo] = useState<VideoDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!videoId) {
      setVideo(null);
      setLoading(false);
      return;
    }

    async function loadVideo() {
      try {
        setLoading(true);
        setError(null);

        const data = await getVideoById(videoId);

        setVideo(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    loadVideo();
  }, [videoId]);

  return {
    video,
    loading,
    error,
  };
}