import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui";
import type { DashboardStat } from "../types";

const accentClasses: Record<DashboardStat["accent"], string> = {
  primary: "bg-primary-500/15 text-primary-300",
  blue: "bg-sky-500/15 text-sky-300",
  violet: "bg-violet-500/15 text-violet-300",
  amber: "bg-amber-500/15 text-amber-300",
};

interface StatCardProps extends DashboardStat {
  icon: LucideIcon;
}

export function StatCard({
  label,
  value,
  description,
  icon: Icon,
  accent,
}: StatCardProps) {
  return (
    <Card className="flex min-w-0 flex-col p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium text-slate-400">{label}</p>
        <span className={`inline-flex rounded-xl p-2.5 ${accentClasses[accent]}`}>
          <Icon aria-hidden="true" size={20} />
        </span>
      </div>
      <p className="mt-5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
        {value}
      </p>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </Card>
  );
}
