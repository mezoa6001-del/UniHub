import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";

import type { CreateChapterInput } from "../validators";

export async function createChapter(
  data: CreateChapterInput
): Promise<string> {
  const docRef = await addDoc(
    collection(db, "chapters"),
    {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  );

  return docRef.id;
}