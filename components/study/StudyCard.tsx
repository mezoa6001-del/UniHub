"use client";

import Link from "next/link";

type StudyCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  count: number;
  unit: string;
  href: string;
  accentColor?: string;
};

export default function StudyCard({
  title,
  description,
  icon,
  count,
  unit,
  href,
  accentColor = "#2FA084",
}: StudyCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-3xl border border-white/10 bg-[#111C33] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary-500 hover:shadow-xl"
    >
      <div className="flex items-start justify-between">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
          style={{
            backgroundColor: `${accentColor}20`,
            color: accentColor,
          }}
        >
          {icon}
        </div>

        <span className="text-sm font-semibold text-primary-400 opacity-0 transition-opacity group-hover:opacity-100">
          Open →
        </span>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-bold text-white">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          {description}
        </p>
      </div>

      <div className="mt-8 flex items-end justify-between">
        <div>
          <div className="text-3xl font-black text-white">
            {count}
          </div>

          <div className="text-sm text-slate-400">
            {unit}
          </div>
        </div>

        <div className="text-primary-400 transition-transform group-hover:translate-x-1">
          →
        </div>
      </div>
    </Link>
  );
}