import {
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";
import type { CurrentUser } from "@/features/shared/types/auth.types";

import { VIDEOS_COLLECTION } from "../constants";
import { updateVideoSchema } from "../schemas/update-video.schema";

export async function updateVideo(
  videoId: string,
  input: unknown,
  currentUser: CurrentUser
) {
  const data = updateVideoSchema.parse(input);

  const videoData = {
    title: data.title.trim(),
    description: data.description.trim(),

    courseId: data.courseId,
    chapterId: data.chapterId,

    provider: data.provider,

    videoUrl: data.videoUrl.trim(),

    thumbnailUrl:
      data.thumbnailUrl?.trim() ?? "",

    durationSeconds: data.durationSeconds,

    order: data.order,

    status: data.status,

    isFreePreview: data.isFreePreview,

    updatedBy: currentUser.uid,
    updatedAt: serverTimestamp(),
  };

  console.group("🎥 Firestore Update Video");
  console.log("Document:", videoId);
  console.log("Payload:", videoData);

  await updateDoc(
    doc(db, VIDEOS_COLLECTION, videoId),
    videoData
  );

  console.groupEnd();
}