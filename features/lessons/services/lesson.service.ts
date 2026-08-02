import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";
import type { Lesson } from "../types";
import type {
  CreateLessonInput,
  UpdateLessonInput,
} from "../validators";

const lessonsRef = collection(db, "lessons");

export async function createLesson(data: CreateLessonInput) {
  return addDoc(lessonsRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateLesson(
  id: string,
  data: UpdateLessonInput
) {
  return updateDoc(doc(db, "lessons", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteLesson(id: string) {
  return deleteDoc(doc(db, "lessons", id));
}

export async function listLessons(chapterId: string): Promise<Lesson[]> {
  const q = query(
    lessonsRef,
    where("chapterId", "==", chapterId),
    orderBy("order")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as Lesson
  );
}