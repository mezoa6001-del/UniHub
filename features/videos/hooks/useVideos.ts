"use client";

import { useEffect, useState } from "react";

import { listVideos } from "../services/list-videos.service";
import type { Video } from "../types/video.types";

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function reload() {
    setIsLoading(true);
    setError(null);

    try {
      const data = await listVideos();
      setVideos(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to load videos.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    reload();
  }, []);

  return {
    videos,
    isLoading,
    error,
    reload,
  };
}