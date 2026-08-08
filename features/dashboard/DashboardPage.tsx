import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  Clock3,
  GraduationCap,
  Target,
} from "lucide-react";

import {
  DashboardHeader,
  QuickActions,
  RecentActivity,
  StatsGrid,
} from "./components";

import type {
  DashboardActivity,
  DashboardQuickAction,
  DashboardStat,
} from "./types";

const dashboardStats: DashboardStat[] = [
  {
    label: "Courses in progress",
    value: "4",
    description: "Continue building your knowledge",
    icon: BookOpen,
    accent: "primary",
  },
  {
    label: "Study time",
    value: "12h 40m",
    description: "This week",
    icon: Clock3,
    accent: "blue",
  },
  {
    label: "Questions completed",
    value: "248",
    description: "32 more than last week",
    icon: ClipboardCheck,
    accent: "violet",
  },
  {
    label: "Average score",
    value: "86%",
    description: "Keep up the great work",
    icon: Target,
    accent: "amber",
  },
];

const quickActions: DashboardQuickAction[] = [
  {
    label: "Browse courses",
    description: "Find your next topic",
    href: "/courses",
    icon: GraduationCap,
  },
  {
    label: "Practice questions",
    description: "Test your knowledge",
    href: "/qbank",
    icon: ClipboardCheck,
  },
  {
    label: "Plan study time",
    description: "Set your next session",
    href: "/study",
    icon: CalendarDays,
  },
];

const recentActivities: DashboardActivity[] = [
  {
    id: "activity-1",
    title: "Completed Pharmacokinetics quiz",
    description: "Scored 9 out of 10 questions",
    timestamp: "20 minutes ago",
    kind: "question",
  },
  {
    id: "activity-2",
    title: "Continued Cardiovascular Pharmacology",
    description: "Watched the beta blockers lesson",
    timestamp: "Yesterday",
    kind: "course",
  },
  {
    id: "activity-3",
    title: "Reached a 5-day study streak",
    description: "Your consistency is paying off",
    timestamp: "2 days ago",
    kind: "question",
  },
];

export function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <DashboardHeader
        title="Welcome back, Student"
        description="Here is a snapshot of your learning progress."
      />

      <StatsGrid stats={dashboardStats} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(19rem,0.85fr)]">
        <RecentActivity activities={recentActivities} />
        <QuickActions actions={quickActions} />
      </div>
    </main>
  );
}