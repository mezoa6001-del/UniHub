import {
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";

import { VIDEOS_COLLECTION } from "../constants";

export async function deleteVideo(
  videoId: string
) {
  console.group("🗑 Delete Video");

  await updateDoc(
    doc(db, VIDEOS_COLLECTION, videoId),
    {
      deletedAt: serverTimestamp(),
    }
  );

  console.groupEnd();
}