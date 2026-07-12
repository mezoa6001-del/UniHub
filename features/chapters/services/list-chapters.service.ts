import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";

import type { Chapter } from "../types";

export async function listChapters(
  courseId: string
): Promise<Chapter[]> {
  const q = query(
    collection(db, "chapters"),
    where("courseId", "==", courseId),
    orderBy("order", "asc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Chapter, "id">),
  }));
}