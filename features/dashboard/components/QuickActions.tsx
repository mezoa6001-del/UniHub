import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { Card } from "@/components/ui";
import type { DashboardQuickAction } from "../types";

interface QuickActionsProps {
  actions: DashboardQuickAction[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <section aria-labelledby="quick-actions-heading">
      <Card className="h-full p-5 sm:p-6">
        <h2 id="quick-actions-heading" className="text-lg font-bold text-white">
          Quick actions
        </h2>
        <p className="mt-1 text-sm text-slate-400">Pick up where you left off.</p>
        <div className="mt-5 space-y-3">
          {actions.map((action) => (
            <QuickActionLink key={action.href} action={action} />
          ))}
        </div>
      </Card>
    </section>
  );
}

function QuickActionLink({ action }: { action: DashboardQuickAction }) {
  const Icon: LucideIcon = action.icon;

  return (
    <Link
      href={action.href}
      className="group flex items-center gap-3 rounded-xl border border-white/8 p-3 text-left transition-colors hover:border-primary-500/50 hover:bg-primary-500/5 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-navy-card"
    >
      <span className="rounded-lg bg-primary-500/15 p-2 text-primary-300">
        <Icon aria-hidden="true" size={18} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-white">{action.label}</span>
        <span className="mt-0.5 block text-xs text-slate-400">{action.description}</span>
      </span>
      <span aria-hidden="true" className="text-lg text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:text-primary-300">→</span>
    </Link>
  );
}
