"use client";

import Link from "next/link";

type Props = {
  title: string;
  subtitle: string;
  count: number;
  icon: string;
  href: string;
  color: string;
};

export default function StudyCard({
  title,
  subtitle,
  count,
  icon,
  href,
  color,
}: Props) {
  return (
    <Link
      href={href}
      className="group block rounded-3xl border border-white/10 bg-navy-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary-500/40 hover:shadow-xl hover:shadow-primary-500/10"
    >
      <div className="flex items-center justify-between">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl text-3xl"
          style={{ backgroundColor: `${color}20` }}
        >
          {icon}
        </div>

        <span className="text-2xl transition-transform group-hover:translate-x-1">
          →
        </span>
      </div>

      <h3 className="mt-5 text-xl font-bold text-white">
        {title}
      </h3>

      <p className="mt-1 text-sm text-slate-400">
        {subtitle}
      </p>

      <div className="mt-6 text-3xl font-black text-white">
        {count}
      </div>

      <div className="text-xs uppercase tracking-wider text-slate-500">
        Available
      </div>

      <div className="mt-6 rounded-xl bg-primary-500/10 py-3 text-center font-semibold text-primary-300 transition-colors group-hover:bg-primary-500 group-hover:text-white">
        Open →
      </div>
    </Link>
  );
}