import { doc, getDoc } from "firebase/firestore";

import { db } from "@/lib/firebase/config";

import type { Course } from "../types";

export async function getCourse(
  courseId: string
): Promise<Course> {
  const snapshot = await getDoc(
    doc(db, "courses", courseId)
  );

  if (!snapshot.exists()) {
    throw new Error("Course not found.");
  }

  return {
    id: snapshot.id,
    ...(snapshot.data() as Omit<Course, "id">),
  };
}