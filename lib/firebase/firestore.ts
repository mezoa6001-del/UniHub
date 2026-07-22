import {
  collection, doc, addDoc, setDoc, getDoc, getDocs,
  updateDoc, deleteDoc, onSnapshot, query, where,
  orderBy, limit, serverTimestamp, increment,
  Timestamp, writeBatch, startAfter, QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./config";
import type {
  UserDoc, ChapterDoc, QuestionDoc, FlashcardDoc,
  FlashcardProgressDoc, VideoDoc, VideoProgressDoc,
  SubscriptionDoc, AttemptDoc, BookmarkDoc, WrongQuestionDoc,
  LeaderboardEntry, NotificationDoc,
} from "@/types";

// ΓöÇΓöÇ Helpers ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
const col  = (name: string) => collection(db, name);
const dref = (path: string, id: string) => doc(db, path, id);
const ts   = () => serverTimestamp();
const inc  = (n: number) => increment(n);

// ΓöÇΓöÇ Users ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
export async function createUserProfile(uid: string, data: Partial<UserDoc>) {
  await setDoc(dref("users", uid), {
    uid, role: "student", streak: 0, totalScore: 0,
    questionsAnswered: 0, correctAnswers: 0,
    showRealName: true, notifications: { subscriptionExpiry: true, newContent: true, weeklyReport: true },
    createdAt: ts(), updatedAt: ts(), ...data,
  });
}

export async function getUserProfile(uid: string): Promise<UserDoc | null> {
  const s = await getDoc(dref("users", uid));
  return s.exists() ? ({ id: s.id, ...s.data() } as unknown as UserDoc) : null;
}

export async function updateUserProfile(uid: string, data: Partial<UserDoc>) {
  await updateDoc(dref("users", uid), { ...data, updatedAt: ts() });
}

export function subscribeToUserProfile(uid: string, cb: (u: UserDoc | null) => void) {
  return onSnapshot(dref("users", uid), (s) =>
    cb(s.exists() ? ({ id: s.id, ...s.data() } as unknown as UserDoc) : null));
}

// ΓöÇΓöÇ Chapters ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
export async function getChapters(): Promise<ChapterDoc[]> {
  const s = await getDocs(query(col("chapters"), orderBy("order", "asc")));
  return s.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as ChapterDoc));
}

export async function createChapter(data: Partial<ChapterDoc>) {
  return addDoc(col("chapters"), { ...data, questionCount: 0, flashcardCount: 0, videoCount: 0, createdAt: ts() });
}

export async function updateChapter(id: string, data: Partial<ChapterDoc>) {
  await updateDoc(dref("chapters", id), { ...data, updatedAt: ts() });
}

export async function deleteChapter(id: string) {
  await deleteDoc(dref("chapters", id));
}

// ΓöÇΓöÇ Questions ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
export async function getQuestions(chapterId?: string): Promise<QuestionDoc[]> {
  let q = query(col("questions"), where("isActive", "==", true));
  if (chapterId) q = query(col("questions"), where("isActive", "==", true), where("chapterId", "==", chapterId));
  const s = await getDocs(q);
  return s.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as QuestionDoc));
}

export async function getQuestionsPaginated(
  chapterId: string | undefined,
  pageSize: number,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{ questions: QuestionDoc[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
  let q = query(col("questions"), where("isActive", "==", true), orderBy("createdAt", "desc"), limit(pageSize));
  if (chapterId) q = query(col("questions"), where("isActive", "==", true), where("chapterId", "==", chapterId), orderBy("createdAt", "desc"), limit(pageSize));
  if (lastDoc) q = query(q, startAfter(lastDoc));
  const s = await getDocs(q);
  return { questions: s.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as QuestionDoc)), lastDoc: s.docs[s.docs.length - 1] ?? null };
}

export async function createQuestion(data: Partial<QuestionDoc>) {
  const cleaned = Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined)
  );

  const ref = await addDoc(col("questions"), {
    ...cleaned,
    isActive: true,
    usageCount: 0,
    correctRate: 0,
    createdAt: ts(),
    updatedAt: ts(),
  });

  if (data.chapterId) {
    await updateDoc(
      dref("chapters", data.chapterId),
      { questionCount: inc(1) }
    );
  }

  return ref;
}

export async function updateQuestion(id: string, data: Partial<QuestionDoc>) {
  const cleaned = Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined)
  );

  await updateDoc(dref("questions", id), {
    ...cleaned,
    updatedAt: ts(),
  });
}

export async function softDeleteQuestion(id: string, chapterId?: string) {
  await updateDoc(dref("questions", id), { isActive: false, updatedAt: ts() });
  if (chapterId) await updateDoc(dref("chapters", chapterId), { questionCount: inc(-1) });
}

// ΓöÇΓöÇ Flashcards ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
export async function getFlashcards(chapterId?: string): Promise<FlashcardDoc[]> {
  const q = chapterId
    ? query(col("flashcards"), where("chapterId", "==", chapterId), where("isActive", "==", true))
    : query(col("flashcards"), where("isActive", "==", true), orderBy("order", "asc"));
  const s = await getDocs(q);
  return s.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as FlashcardDoc));
}

export async function createFlashcard(data: Partial<FlashcardDoc>) {
  return addDoc(col("flashcards"), { ...data, isActive: true, createdAt: ts() });
}

export async function updateFlashcard(id: string, data: Partial<FlashcardDoc>) {
  await updateDoc(dref("flashcards", id), { ...data, updatedAt: ts() });
}

export async function deleteFlashcard(id: string) {
  await updateDoc(dref("flashcards", id), { isActive: false });
}

// ΓöÇΓöÇ Flashcard Progress (SM-2) ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
export function sm2Next(prev: Partial<FlashcardProgressDoc>, difficulty: "easy" | "medium" | "hard") {
  const q: Record<string, number> = { easy: 5, medium: 3, hard: 1 };
  let { interval = 1, repetitions = 0, easeFactor = 2.5 } = prev;
  if (q[difficulty] >= 3) {
    interval     = repetitions === 0 ? 1 : repetitions === 1 ? 6 : Math.round(interval * easeFactor);
    repetitions += 1;
  } else { interval = 1; repetitions = 0; }
  easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - q[difficulty]) * (0.08 + (5 - q[difficulty]) * 0.02));
  const next = new Date(); next.setDate(next.getDate() + interval);
  return { interval, repetitions, easeFactor, nextReviewAt: Timestamp.fromDate(next) };
}

export async function saveFlashcardProgress(uid: string, fcId: string, data: object) {
  await setDoc(doc(db, "flashcard_progress", `${uid}_${fcId}`),
    { userId: uid, flashcardId: fcId, ...data, lastReviewedAt: ts() }, { merge: true });
}

export async function getUserFlashcardProgress(uid: string): Promise<Record<string, FlashcardProgressDoc>> {
  const s = await getDocs(query(col("flashcard_progress"), where("userId", "==", uid)));
  const m: Record<string, FlashcardProgressDoc> = {};
  s.docs.forEach((d) => { m[d.data().flashcardId] = { id: d.id, ...d.data() } as unknown as FlashcardProgressDoc; });
  return m;
}

// ΓöÇΓöÇ Videos ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
export async function getVideos(
  chapterId?: string,
  includeDrafts = false
): Promise<VideoDoc[]> {
  const q =
    chapterId
      ? query(
          col("videos"),
          where("chapterId", "==", chapterId),
          ...(includeDrafts ? [] : [where("isPublished", "==", true)]),
          orderBy("order", "asc")
        )
      : query(
          col("videos"),
          ...(includeDrafts ? [] : [where("isPublished", "==", true)]),
          orderBy("order", "asc")
        );

  const s = await getDocs(q);

  return s.docs.map(
    (d) =>
      ({
        id: d.id,
        ...d.data(),
      }) as VideoDoc
  );
}

export async function createVideo(data: Partial<VideoDoc>) {
  return addDoc(col("videos"), { ...data, isPublished: false, viewCount: 0, createdAt: ts() });
}

export async function updateVideo(id: string, data: Partial<VideoDoc>) {
  await updateDoc(dref("videos", id), { ...data, updatedAt: ts() });
}

export async function deleteVideo(id: string) {
  await deleteDoc(dref("videos", id));
}

// ΓöÇΓöÇ Video Progress ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
export async function saveVideoProgress(uid: string, videoId: string, watched: number, total: number) {
  const pct = Math.round((watched / total) * 100);
  await setDoc(doc(db, "video_progress", `${uid}_${videoId}`),
    { userId: uid, videoId, watchedSeconds: watched, totalSeconds: total, percentage: pct, completed: pct >= 95, lastWatchedAt: ts() },
    { merge: true });
  if (pct >= 95) await updateDoc(dref("videos", videoId), { viewCount: inc(1) }).catch(() => {});
}

export async function getUserVideoProgress(uid: string): Promise<Record<string, VideoProgressDoc>> {
  const s = await getDocs(query(col("video_progress"), where("userId", "==", uid)));
  const m: Record<string, VideoProgressDoc> = {};
  s.docs.forEach((d) => { m[d.data().videoId] = { id: d.id, ...d.data() } as unknown as VideoProgressDoc; });
  return m;
}

// ΓöÇΓöÇ Bookmarks ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
export async function getUserBookmarks(uid: string): Promise<BookmarkDoc[]> {
  const s = await getDocs(query(col("bookmarks"), where("userId", "==", uid)));
  return s.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as BookmarkDoc));
}

export async function addBookmark(uid: string, questionId: string, note = "") {
  return addDoc(col("bookmarks"), { userId: uid, questionId, note, createdAt: ts() });
}

export async function removeBookmark(id: string) {
  await deleteDoc(dref("bookmarks", id));
}

// ΓöÇΓöÇ Wrong Questions ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
export async function getUserWrongQuestions(uid: string): Promise<WrongQuestionDoc[]> {
  const s = await getDocs(query(col("wrong_questions"), where("userId", "==", uid), where("resolved", "==", false)));
  return s.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as WrongQuestionDoc));
}

export async function recordWrongQuestion(uid: string, questionId: string, chapterId: string) {
  const ex = await getDocs(query(col("wrong_questions"), where("userId", "==", uid), where("questionId", "==", questionId)));
  if (ex.empty) {
    await addDoc(col("wrong_questions"), { userId: uid, questionId, chapterId, wrongCount: 1, resolved: false, lastWrongAt: ts() });
  } else {
    await updateDoc(ex.docs[0].ref, { wrongCount: inc(1), lastWrongAt: ts(), resolved: false });
  }
}

export async function resolveWrongQuestion(id: string) {
  await updateDoc(dref("wrong_questions", id), { resolved: true });
}

// ΓöÇΓöÇ Attempts ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
export async function saveAttempt(uid: string, data: Partial<AttemptDoc>, displayName: string) {
  await addDoc(col("attempts"), { userId: uid, ...data, completedAt: ts() });
  await updateDoc(dref("users", uid), {
    questionsAnswered: inc(data.totalQuestions ?? 0),
    correctAnswers:    inc(data.correctCount   ?? 0),
    totalScore:        inc(data.score          ?? 0),
    updatedAt:         ts(),
  });
  await setDoc(
  dref("leaderboard", uid),
  {
    displayName,
    totalScore: inc(data.score ?? 0),
    questionsAnswered: inc(data.totalQuestions ?? 0),
    correctAnswers: inc(data.correctCount ?? 0),
    weeklyScore: inc(data.score ?? 0),
    updatedAt: ts(),
  },
  { merge: true }
);
}

export async function getUserAttempts(uid: string): Promise<AttemptDoc[]> {
  const s = await getDocs(query(col("attempts"), where("userId", "==", uid), orderBy("completedAt", "desc"), limit(50)));
  return s.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as AttemptDoc));
}

// ΓöÇΓöÇ Leaderboard ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const s = await getDocs(query(col("leaderboard"), orderBy("totalScore", "desc"), limit(20)));
  return s.docs.map((d, i) => ({ id: d.id, rank: i + 1, ...d.data() } as unknown as LeaderboardEntry));
}

export function subscribeLeaderboard(cb: (entries: LeaderboardEntry[]) => void) {
  return onSnapshot(
    query(col("leaderboard"), orderBy("totalScore", "desc"), limit(20)),
    (s) => cb(s.docs.map((d, i) => ({ id: d.id, rank: i + 1, ...d.data() } as unknown as LeaderboardEntry)))
  );
}

// ΓöÇΓöÇ Subscription ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
export function subscribeToSubscription(uid: string, cb: (sub: (SubscriptionDoc & { isActive: boolean }) | null) => void) {
  return onSnapshot(dref("subscriptions", uid), (s) => {
    if (!s.exists()) { cb(null); return; }
    const d   = s.data() as SubscriptionDoc;
    const exp = (d.expiresAt as any)?.toDate ? (d.expiresAt as any).toDate() : new Date(d.expiresAt as any);
    cb({ ...d, isActive: d.status === "active" && exp > new Date(), expiresAt: exp });
  });
}

// ΓöÇΓöÇ Notifications ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
export function subscribeToNotifications(uid: string, cb: (n: NotificationDoc[]) => void) {
  return onSnapshot(
    query(col("notifications"), where("userId", "==", uid), orderBy("createdAt", "desc"), limit(30)),
    (s) => cb(s.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as NotificationDoc)))
  );
}

export async function markNotificationRead(id: string) {
  await updateDoc(dref("notifications", id), { read: true });
}

export async function markAllNotificationsRead(uid: string) {
  const s  = await getDocs(query(col("notifications"), where("userId", "==", uid), where("read", "==", false)));
  const b  = writeBatch(db);
  s.docs.forEach((d) => b.update(d.ref, { read: true }));
  await b.commit();
}

// ΓöÇΓöÇ Admin helpers ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
export async function listAllUsers(pageSize = 50, lastDoc?: QueryDocumentSnapshot<DocumentData>) {
  let q = query(col("users"), orderBy("createdAt", "desc"), limit(pageSize));
  if (lastDoc) q = query(q, startAfter(lastDoc));
  const s = await getDocs(q);
  return { users: s.docs.map((d) => ({ id: d.id, ...d.data() })), lastDoc: s.docs[s.docs.length - 1] ?? null };
}
