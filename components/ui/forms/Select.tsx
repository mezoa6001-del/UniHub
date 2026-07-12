"use client";

import * as React from "react";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = React.forwardRef<
  HTMLSelectElement,
  SelectProps
>(function Select(
  { className = "", children, ...props },
  ref
) {
  return (
    <select
      ref={ref}
      className={[
        "w-full rounded-xl border border-white/10",
        "bg-navy-card px-4 py-3",
        "text-white outline-none transition",
        "focus:border-primary-500",
        "focus:ring-2 focus:ring-primary-500/20",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </select>
  );
});