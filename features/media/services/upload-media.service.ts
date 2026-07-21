import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import { storage } from "@/lib/firebase/config";

import type {
  MediaFolder,
  UploadedMedia,
} from "../types";

interface UploadMediaParams {
  file: File;
  folder: MediaFolder;
  onProgress?: (progress: number) => void;
}

export async function uploadMedia({
  file,
  folder,
  onProgress,
}: UploadMediaParams): Promise<UploadedMedia> {
  const fileName = `${Date.now()}-${file.name}`;

  const storageRef = ref(
    storage,
    `${folder}/${fileName}`
  );

  const uploadTask = uploadBytesResumable(
    storageRef,
    file
  );

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred /
            snapshot.totalBytes) *
          100;

        onProgress?.(progress);
      },
      reject,
      async () => {
        const url = await getDownloadURL(
          uploadTask.snapshot.ref
        );

        resolve({
          name: file.name,
          url,
          path: uploadTask.snapshot.ref.fullPath,
          size: file.size,
          type: file.type,
        });
      }
    );
  });
}