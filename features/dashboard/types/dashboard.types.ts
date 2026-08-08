import type { LucideIcon } from "lucide-react";

export type DashboardStatAccent = "primary" | "blue" | "violet" | "amber";

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

export interface DashboardActivity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  icon: LucideIcon;
}
