// ═══════════════════════════════════════════════════════════
//  UniHub — TypeScript Types
//  by Dr. Mazen Ashraf
// ═══════════════════════════════════════════════════════════

import type { Timestamp } from "firebase/firestore";

export type FsTs = Timestamp | Date | null;

// ── Roles & Enums ──────────────────────────────────────────
export type UserRole    = "student" | "admin" | "superadmin";
export type SubStatus   = "active" | "expired" | "cancelled";
export type PlanId      = "1_month" | "3_months" | "6_months" | "12_months";
export type Difficulty  = "easy" | "medium" | "hard";
export type ExamMode    = "standard" | "timed" | "random" | "chapter" | "bookmarks" | "wrong_review" | "quick";
export type VideoProvider = "firebase" | "bunny" | "vimeo";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";
export type NotifType   = "subscription_expiry" | "subscription_activated" | "new_video" | "new_flashcards" | "new_exam" | "new_chapter" | "achievement";

// ── Custom JWT Claims ───────────────────────────────────────
export interface CustomClaims {
  role:         UserRole;
  subscribed:   boolean;
  subPlan:      PlanId | null;
  subExpiresAt: number | null;
}

// ── Firestore Documents ─────────────────────────────────────

export interface UserDoc {
  uid:               string;
  email:             string;
  displayName:       string;
  photoURL:          string | null;
  role:              UserRole;
  nickname?:         string;
  showRealName:      boolean;
  streak:            number;
  lastActiveDate?:   string;
  totalScore:        number;
  questionsAnswered: number;
  correctAnswers:    number;
  phone?:            string;
  fcmToken?:         string;
  notifications: {
    subscriptionExpiry: boolean;
    newContent:         boolean;
    weeklyReport:       boolean;
  };
  createdAt: FsTs;
  updatedAt: FsTs;
}

export interface ChapterDoc {
  id:             string;
  name:           string;
  icon:           string;
  description:    string;
  order:          number;
  color:          string;
  questionCount:  number;
  flashcardCount: number;
  videoCount:     number;
  isPublished:    boolean;
  createdAt:      FsTs;
  updatedAt?:     FsTs;
}

export interface QuestionOption { id: string; text: string; }

export interface QuestionDoc {
  id:           string;
  chapterId:    string;
  chapterName:  string;
  text:         string;
  type:         "single" | "multiple";
  options:      QuestionOption[];
  correctAnswer: string | string[];
  explanation:  string;
  references:   string[];
  tags:         string[];
  difficulty:   Difficulty;
  source?:      string;
  year?:        number;
  isActive:     boolean;
  usageCount:   number;
  commentCount?: number;
  correctRate:  number;
  createdBy:    string;
  createdAt:    FsTs;
  updatedAt:    FsTs;
}

export interface FlashcardDoc {
  id:              string;
  chapterId:       string;
  front:           string;
  back:            string;
  imageUrl?:       string;
  tags:            string[];
  order:           number;
  type?:           "basic" | "cloze" | "rapid";
  aiGenerated?:    boolean;
  sourceQuestion?: string;
  isActive:        boolean;
  createdBy:       string;
  createdAt:       FsTs;
  updatedAt?:      FsTs;
}

export interface FlashcardProgressDoc {
  id:             string;
  userId:         string;
  flashcardId:    string;
  difficulty:     Difficulty;
  interval:       number;
  repetitions:    number;
  easeFactor:     number;
  nextReviewAt:   FsTs;
  lastReviewedAt: FsTs;
}

export interface VideoDoc {
  id:            string;
  chapterId:     string;
  chapterName: string;
  title:         string;
  description:   string;
  instructorName: string;
  duration:      number;
  thumbnailUrl:  string;
  storageRef?:   string;
  videoUrl?:   string;
  externalUrl?:  string;
  provider:      VideoProvider;
  bunnyVideoId?: string;
  order:         number;
  isPublished:   boolean;
  viewCount:     number;
  createdBy:     string;
  createdAt:     FsTs;
  updatedAt?:    FsTs;
}

export interface VideoProgressDoc {
  id:             string;
  userId:         string;
  videoId:        string;
  watchedSeconds: number;
  totalSeconds:   number;
  percentage:     number;
  completed:      boolean;
  lastWatchedAt:  FsTs;
}

export interface SubscriptionDoc {
  userId:        string;
  planId:        PlanId;
  planName:      string;
  status:        SubStatus;
  startDate:     FsTs;
  expiresAt:     FsTs | Date;
  price:         number;
  currency:      string;
  paymentMethod: string;
  paymobOrderId?: number;
  paymobTxId?:   string;
  autoRenew:     boolean;
  isActive?:     boolean;
  createdAt:     FsTs;
  updatedAt:     FsTs;
}

export interface PaymentDoc {
  userId:          string;
  planId:          PlanId;
  planName:        string;
  amountCents:     number;
  currency:        string;
  paymentMethod:   string;
  paymobOrderId:   number;
  merchantOrderId: string;
  paymentKey?:     string;
  iframeUrl?:      string;
  paymobTxId?:     string;
  status:          PaymentStatus;
  createdAt:       FsTs;
  completedAt?:    FsTs;
}

export interface AttemptAnswer {
  selected:  string;
  correct:   boolean;
  timeSpent: number;
}

export interface AttemptDoc {
  id:             string;
  userId:         string;
  mode:           ExamMode;
  chapterIds:     string[];
  questionIds:    string[];
  answers:        Record<string, AttemptAnswer>;
  totalQuestions: number;
  correctCount:   number;
  wrongCount:     number;
  score:          number;
  timeTaken:      number;
  completed:      boolean;
  startedAt:      number;
  completedAt:    FsTs;
}

export interface BookmarkDoc {
  id:          string;
  userId:      string;
  questionId:  string;
  note?:       string;
  createdAt:   FsTs;
  updatedAt?:  FsTs;
}

export interface WrongQuestionDoc {
  id:          string;
  userId:      string;
  questionId:  string;
  chapterId:   string;
  attemptId?:  string;
  wrongCount:  number;
  resolved:    boolean;
  lastWrongAt: FsTs;
}

export interface LeaderboardEntry {
  id:                string;
  rank?:             number;
  displayName:       string;
  avatarInitials:    string;
  totalScore:        number;
  questionsAnswered: number;
  correctAnswers?:   number;
  accuracy:          number;
  weeklyScore:       number;
  updatedAt:         FsTs;
}

export interface NotificationDoc {
  id:        string;
  userId:    string;
  type:      NotifType;
  title:     string;
  body:      string;
  read:      boolean;
  data?:     Record<string, unknown>;
  createdAt: FsTs;
}

export interface AiExplanationDoc {
  questionId:      string;
  whyCorrect:      string;
  whyWrong:        Record<string, string>;
  highYieldPoints: string[];
  examPearls:      string[];
  mnemonic:        string | null;
  flashcards:      Array<{ front: string; back: string; type: string }>;
  generatedAt:     FsTs;
  generatedBy:     string;
  model:           string;
}

export interface CommentDoc {
  id:          string;
  questionId:  string;
  userId:      string;
  displayName: string;
  text:        string;
  parentId:    string | null;
  upvotes:     number;
  upvotedBy:   string[];
  isReported:  boolean;
  reportCount: number;
  isDeleted:   boolean;
  moderatedBy: string | null;
  createdAt:   FsTs;
  updatedAt:   FsTs;
}

// ── Exam Session (client-side) ──────────────────────────────
export interface ExamSession {
  questions:  QuestionDoc[];
  mode:       ExamMode;
  startedAt:  number;
  timed?:     boolean;
  chapterId?: string;
}

// ── Plan definitions ────────────────────────────────────────
export interface Plan {
  id:       PlanId;
  name:     string;
  price:    number;
  months:   number;
  currency: string;
  popular?: boolean;
  save?:    string;
  features: string[];
}

export const PLANS: Plan[] = [
  { id: "1_month",  name: "1 Month",   price: 199,  months: 1,  currency: "EGP",
    features: ["Full Question Bank", "Flashcards", "Videos", "Analytics"] },
  { id: "3_months", name: "3 Months",  price: 499,  months: 3,  currency: "EGP",
    popular: true, save: "17%",
    features: ["Everything in 1 Month", "Leaderboard", "PDF Export", "Priority Support"] },
  { id: "6_months", name: "6 Months",  price: 849,  months: 6,  currency: "EGP",
    save: "29%",
    features: ["Everything in 3 Months", "Offline Mode", "Custom Study Plans"] },
  { id: "12_months",name: "12 Months", price: 1499, months: 12, currency: "EGP",
    save: "37%",
    features: ["All Features", "Personal Mentor", "Mock Exams"] },
];
