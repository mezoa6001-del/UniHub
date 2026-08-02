import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";

import { VIDEOS_COLLECTION } from "../constants";
import type { Video } from "../types/video.types";

export async function listVideos(): Promise<
  Video[]
> {
  const q = query(
    collection(db, VIDEOS_COLLECTION),
    where("deletedAt", "==", null),
    orderBy("order", "asc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Video, "id">),
  }));
}