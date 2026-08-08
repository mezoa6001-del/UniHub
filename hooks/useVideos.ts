"use client";

import { useEffect, useState } from "react";

import { getVideos } from "@/lib/firebase/firestore";
import type { VideoDoc } from "@/types";

type UseVideosResult = {
  videos: VideoDoc[];
  loading: boolean;
  error: Error | null;
};

export function useVideos(
  chapterId: string
): UseVideosResult {
  const [videos, setVideos] = useState<VideoDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!chapterId) {
      setVideos([]);
      setLoading(false);
      return;
    }

    async function loadVideos() {
      try {
        setLoading(true);
        setError(null);

        const data = await getVideos(chapterId);

        setVideos(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    loadVideos();
  }, [chapterId]);

  return {
    videos,
    loading,
    error,
  };
}