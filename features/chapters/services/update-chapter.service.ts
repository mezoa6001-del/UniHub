import {
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";

import type { CreateChapterInput } from "../validators";

export async function updateChapter(
  chapterId: string,
  data: CreateChapterInput
): Promise<void> {
  await updateDoc(
    doc(db, "chapters", chapterId),
    {
      ...data,
      updatedAt: serverTimestamp(),
    }
  );
}