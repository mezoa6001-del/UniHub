"use client";

import * as React from "react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(function Textarea(
  { className = "", ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      className={[
        "w-full rounded-xl border border-white/10",
        "bg-navy-card px-4 py-3",
        "text-white placeholder:text-slate-500",
        "outline-none transition",
        "focus:border-primary-500",
        "focus:ring-2 focus:ring-primary-500/20",
        className,
      ].join(" ")}
      {...props}
    />
  );
});