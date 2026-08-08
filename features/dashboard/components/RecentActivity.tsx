import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui";
import type { DashboardActivity } from "../types";

interface RecentActivityProps {
  activities: DashboardActivity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <section aria-labelledby="recent-activity-heading">
      <Card className="h-full p-5 sm:p-6">
        <div>
          <h2 id="recent-activity-heading" className="text-lg font-bold text-white">
            Recent activity
          </h2>
          <p className="mt-1 text-sm text-slate-400">Your latest learning milestones.</p>
        </div>
        <ol className="mt-6 divide-y divide-white/8">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </ol>
      </Card>
    </section>
  );
}

function ActivityItem({ activity }: { activity: DashboardActivity }) {
  const Icon: LucideIcon = activity.icon;

  return (
    <li className="flex gap-3 py-4 first:pt-0 last:pb-0">
      <span className="mt-0.5 rounded-lg bg-primary-500/15 p-2 text-primary-300">
        <Icon aria-hidden="true" size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white">{activity.title}</p>
        <p className="mt-1 text-sm text-slate-400">{activity.description}</p>
      </div>
      <time className="shrink-0 text-xs text-slate-500">{activity.timestamp}</time>
    </li>
  );
}
