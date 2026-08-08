import { getDocs, limit, query, where } from "firebase/firestore";

import { col } from "@/lib/firebase/helpers";
import type { StudyProgressDoc } from "@/types";

export async function getResumeLearning(
  userId: string
): Promise<StudyProgressDoc | null> {
  const snapshot = await getDocs(
    query(
      col("study_progress"),
      where("userId", "==", userId),
      limit(1)
    )
  );

  if (snapshot.empty) {
    return null;
  }

  return {
    id: snapshot.docs[0].id,
    ...(snapshot.docs[0].data() as Omit<StudyProgressDoc, "id">),
  };
}