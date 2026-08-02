import {
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";

import { VIDEOS_COLLECTION } from "../constants";
import type { Video } from "../types/video.types";

export async function getVideo(
  videoId: string
): Promise<Video | null> {
  const snapshot = await getDoc(
    doc(db, VIDEOS_COLLECTION, videoId)
  );

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data() as Video;

  if (data.deletedAt) {
    return null;
  }

  return {
  ...data,
  id: snapshot.id,
};
}