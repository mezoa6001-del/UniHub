import {
  collection,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";

import type {
  DashboardActivity,
  DashboardActivityKind,
  DashboardData,
} from "../types";

const dashboardCollections = {
  courses: "courses",
  chapters: "chapters",
  videos: "videos",
  questions: "questions",
  flashcards: "flashcards",
  users: "users",
} as const;

interface DashboardDocumentData {
  title?: unknown;
  text?: unknown;
  name?: unknown;
  description?: unknown;
  createdAt?: unknown;
}

interface TimestampLike {
  toDate: () => Date;
}

export async function getDashboardData(): Promise<DashboardData> {
  const [counts, activityResults] = await Promise.all([
    getDashboardCounts(),
    Promise.all([
      getLatestActivity("course", dashboardCollections.courses),
      getLatestActivity("chapter", dashboardCollections.chapters),
      getLatestActivity("video", dashboardCollections.videos),
      getLatestActivity("question", dashboardCollections.questions),
    ]),
  ]);

  return {
    counts,
    recentActivity: activityResults.filter(isDashboardActivity),
  };
}

async function getDashboardCounts(): Promise<DashboardData["counts"]> {
  const [courses, chapters, videos, questions, flashcards, users] =
    await Promise.all(
      Object.values(dashboardCollections).map(async (collectionName) => {
        const snapshot = await getCountFromServer(collection(db, collectionName));
        return snapshot.data().count;
      })
    );

  return { courses, chapters, videos, questions, flashcards, users };
}

async function getLatestActivity(
  kind: DashboardActivityKind,
  collectionName: string
): Promise<DashboardActivity | null> {
  const snapshot = await getDocs(
    query(
      collection(db, collectionName),
      orderBy("createdAt", "desc"),
      limit(1)
    )
  );
  const document = snapshot.docs[0];

  if (!document) {
    return null;
  }

  const data = document.data() as DashboardDocumentData;
  const title = readTitle(data, kind);

  return {
    id: `${kind}-${document.id}`,
    kind,
    title: `New ${kind}: ${title}`,
    description: getActivityDescription(kind),
    timestamp: formatRelativeTime(data.createdAt),
  };
}

function readTitle(data: DashboardDocumentData, kind: DashboardActivityKind): string {
  const value = kind === "question" ? data.text ?? data.title : data.title ?? data.name;

  return typeof value === "string" && value.trim().length > 0
    ? value
    : `Untitled ${kind}`;
}

function getActivityDescription(kind: DashboardActivityKind): string {
  switch (kind) {
    case "course":
      return "A new course was added.";
    case "chapter":
      return "A new chapter was added.";
    case "video":
      return "A new video was added.";
    case "question":
      return "A new question was added.";
  }
}

function formatRelativeTime(value: unknown): string {
  const date = toDate(value);

  if (!date) {
    return "Recently";
  }

  const elapsedMilliseconds = Date.now() - date.getTime();
  const elapsedMinutes = Math.max(0, Math.floor(elapsedMilliseconds / 60_000));

  if (elapsedMinutes < 1) return "Just now";
  if (elapsedMinutes < 60) return `${elapsedMinutes}m ago`;

  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `${elapsedHours}h ago`;

  return `${Math.floor(elapsedHours / 24)}d ago`;
}

function toDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return value;
  }

  if (isTimestampLike(value)) {
    return value.toDate();
  }

  return null;
}

function isTimestampLike(value: unknown): value is TimestampLike {
  return (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof value.toDate === "function"
  );
}

function isDashboardActivity(
  activity: DashboardActivity | null
): activity is DashboardActivity {
  return activity !== null;
}
