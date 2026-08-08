import type { LucideIcon } from "lucide-react";

export type DashboardStatAccent = "primary" | "blue" | "violet" | "amber";
export type DashboardActivityKind = "course" | "chapter" | "video" | "question";

export interface DashboardStat {
  label: string;
  value: string;
  description: string;
  icon: LucideIcon;
  accent: DashboardStatAccent;
}

export interface DashboardQuickAction {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export interface DashboardCounts {
  courses: number;
  chapters: number;
  videos: number;
  questions: number;
  flashcards: number;
  users: number;
}

export interface DashboardActivity {
  id: string;
  kind: DashboardActivityKind;
  title: string;
  description: string;
  timestamp: string;
}

export interface DashboardData {
  counts: DashboardCounts;
  recentActivity: DashboardActivity[];
}
