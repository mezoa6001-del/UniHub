"use client";

import { useState } from "react";

import { uploadMedia } from "../services";
import type {
  MediaFolder,
  UploadedMedia,
} from "../types";

export function useUploadMedia() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  async function upload(
    file: File,
    folder: MediaFolder
  ): Promise<UploadedMedia> {
    setUploading(true);
    setProgress(0);

    try {
      return await uploadMedia({
        file,
        folder,
        onProgress: setProgress,
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }

  return {
    upload,
    uploading,
    progress,
  };
}