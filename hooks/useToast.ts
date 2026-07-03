"use client";
import { useState, useCallback } from "react";

export interface ToastState {
  msg:  string;
  type: "success" | "error" | "info";
}

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((msg: string, type: ToastState["type"] = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  }, []);

  return { toast, showToast };
}
