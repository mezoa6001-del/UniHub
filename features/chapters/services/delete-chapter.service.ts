import { deleteDoc, doc } from "firebase/firestore";

import { db } from "@/lib/firebase/config";

export async function deleteChapter(
  chapterId: string
): Promise<void> {
  await deleteDoc(doc(db, "chapters", chapterId));
}