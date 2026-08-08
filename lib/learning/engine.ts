import { saveVideoProgress } from "@/lib/firebase/firestore";

import { updateStudyProgress } from "./progress";

export type RecordVideoCompletionParams = {
  userId: string;
  courseId: string;
  chapterId: string;
  videoId: string;
  watchedSeconds: number;
  totalSeconds: number;
};

export async function recordVideoCompletion({
  userId,
  courseId,
  
  chapterId,
  
  videoId,
  watchedSeconds,
  totalSeconds,
}: RecordVideoCompletionParams) {
  // Save raw video progress
  await saveVideoProgress(
    userId,
    videoId,
    watchedSeconds,
    totalSeconds
  );

  // Update study progress
 await updateStudyProgress({
  userId,
  courseId,
  chapterId,
  currentVideoId: videoId,
});
}