"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

/* -------------------------------------------------------------------------- */
/*                                    Badge                                   */
/* -------------------------------------------------------------------------- */

export function Badge({
  children,
  color = "#2FA084",
  className = "",
}: {
  children: ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block whitespace-nowrap rounded-md px-2 py-0.5 text-[11px] font-bold",
        className
      )}
      style={{
        background: `${color}22`,
        color,
        border: `1px solid ${color}44`,
      }}
    >
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Spinner                                   */
/* -------------------------------------------------------------------------- */

export function Spinner({
  size = 32,
  color = "#2FA084",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: `3px solid ${color}30`,
        borderTopColor: color,
        animation: "spin .8s linear infinite",
      }}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                                Progress Ring                               */
/* -------------------------------------------------------------------------- */

export function Ring({
  value,
  size = 60,
  stroke = 5,
  color = "#2FA084",
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  return (
    <svg
      width={size}
      height={size}
      style={{ transform: "rotate(-90deg)" }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,.08)"
        strokeWidth={stroke}
      />

      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={c}
        strokeDashoffset={c - (value / 100) * c}
        strokeLinecap="round"
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Progress Bar                                 */
/* -------------------------------------------------------------------------- */

export function ProgressBar({
  value,
  color = "#2FA084",
  height = 6,
}: {
  value: number;
  color?: string;
  height?: number;
}) {
  return (
    <div
      className="w-full overflow-hidden rounded-full bg-white/8"
      style={{ height }}
    >
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${value}%`,
          background: color,
        }}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    Toast                                   */
/* -------------------------------------------------------------------------- */

export function Toast({
  msg,
  type,
  onClose,
}: {
  msg: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}) {
  const bg =
    type === "error"
      ? "#EF4444"
      : type === "info"
      ? "#3B82F6"
      : "#2FA084";

  return (
    <div
      className="fixed right-5 top-5 z-[9999] flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-2xl"
      style={{ background: bg }}
    >
      {msg}

      <button onClick={onClose}>×</button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Skeleton                                  */
/* -------------------------------------------------------------------------- */

export function Skeleton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={cn("skeleton rounded-lg", className)}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Empty State                                */
/* -------------------------------------------------------------------------- */

export function EmptyState({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="px-4 py-16 text-center">
      <div className="mb-4 text-5xl">{icon}</div>

      <h3 className="mb-2 text-lg font-bold text-white">
        {title}
      </h3>

      <p className="text-sm text-slate-400">
        {desc}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    Card                                    */
/* -------------------------------------------------------------------------- */

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/8 bg-navy-card p-6",
        className
      )}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Primary Button                               */
/* -------------------------------------------------------------------------- */

interface PrimaryBtnProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

export function PrimaryBtn({
  children,
  loading = false,
  startIcon,
  endIcon,
  className,
  disabled,
  ...props
}: PrimaryBtnProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-secondary px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      {loading && <Spinner size={16} />}

      {!loading && startIcon}

      <span>{children}</span>

      {!loading && endIcon}
    </button>
  );
}
export { StatsCard } from "@/features/courses/components/cards/StatsCard";
export * from "./dialogs";
export * from "./forms";

