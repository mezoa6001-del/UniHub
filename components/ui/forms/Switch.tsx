"use client";

import * as React from "react";

export interface SwitchProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Switch = React.forwardRef<
  HTMLInputElement,
  SwitchProps
>(function Switch(props, ref) {
  return (
    <input
      ref={ref}
      type="checkbox"
      className="h-5 w-5 rounded border-white/20 accent-primary-500"
      {...props}
    />
  );
});