"use client";

import Link from "next/link";

type QuestionModeCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  accentColor?: string;
};

export default function QuestionModeCard({
  title,
  description,
  icon,
  href,
  accentColor = "#2FA084",
}: QuestionModeCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-3xl border border-white/10 bg-[#111C33] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary-500"
    >
      <div
        className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
        style={{
          backgroundColor: `${accentColor}20`,
          color: accentColor,
        }}
      >
        {icon}
      </div>

      <h3 className="mt-6 text-2xl font-bold text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {description}
      </p>

      <div className="mt-8 flex justify-end text-primary-400 transition-transform group-hover:translate-x-1">
        Start →
      </div>
    </Link>
  );
}