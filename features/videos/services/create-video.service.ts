import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";

import type { CurrentUser } from "@/features/shared/types/auth.types";
import { VIDEOS_COLLECTION } from "../constants";
import { createVideoSchema } from "../schemas/create-video.schema";

export async function createVideo(
  input: unknown,
  currentUser: CurrentUser
) {
  const data = createVideoSchema.parse(input);

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

    isFreePreview:
      data.isFreePreview,

    createdBy: currentUser.uid,
    updatedBy: currentUser.uid,

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),

    deletedAt: null,
  };

  console.group("🎥 Firestore Create Video");
  console.log(
    "Collection:",
    VIDEOS_COLLECTION
  );
  console.log("Payload:", videoData);

  const docRef = await addDoc(
    collection(db, VIDEOS_COLLECTION),
    videoData
  );

  console.log("Document ID:", docRef.id);
  console.groupEnd();

  return {
    id: docRef.id,
  };
}