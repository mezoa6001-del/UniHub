"use client";

import type { ReactNode } from "react";

interface DialogProps {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
}

export function Dialog({
  open,
  title,
  description,
  children,
  onClose,
  footer,
}: DialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-navy-card shadow-2xl">
        <div className="flex items-start justify-between border-b border-white/10 p-6">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {title}
            </h2>

            {description && (
              <p className="mt-2 text-sm text-slate-400">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {children}
        </div>

        {footer && (
          <div className="flex justify-end gap-3 border-t border-white/10 p-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}