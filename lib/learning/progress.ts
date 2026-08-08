import {
  getStudyProgress,
  upsertStudyProgress,
} from "@/lib/firebase/firestore";

import type { StudyProgressDoc } from "@/types";

type UpdateStudyProgressParams = {
  userId: string;
  courseId: string;
  chapterId: string;
  currentVideoId: string;
};
export async function updateStudyProgress({
  userId,
  courseId,
  
  chapterId,
  currentVideoId,
}: UpdateStudyProgressParams) {
  const current = await getStudyProgress(
    userId,
    chapterId
  );

  if (!current) {
    const progress: StudyProgressDoc = {
      id: `${userId}_${chapterId}`,
      userId,
      courseId,
    
      chapterId,

      completedVideos: 0,
      totalVideos: 0,

      completedQuestions: 0,
      totalQuestions: 0,

      masteredFlashcards: 0,
      totalFlashcards: 0,

      overallProgress: 0,

      currentVideoId,

      lastActivityAt: new Date() as any,
      createdAt: new Date() as any,
      updatedAt: new Date() as any,
    };

    await upsertStudyProgress(progress);

    return;
  }

  await upsertStudyProgress({
    ...current,
    currentVideoId,
  });
}