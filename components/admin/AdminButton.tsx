import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

export default function AdminButton({
  variant = "primary",
  className,
  children,
  ...props
}: Props) {
  const styles = {
    primary:
      "bg-[#2FA084] hover:bg-[#38b896] text-white",

    secondary:
      "bg-[#1A2942] hover:bg-[#22344f] text-white border border-slate-700",

    danger:
      "bg-red-600 hover:bg-red-500 text-white",
  };

  return (
    <button
      {...props}
      className={cn(
        "px-5 py-2.5 rounded-xl font-semibold transition-all duration-200",
        styles[variant],
        className
      )}
    >
      {children}
    </button>
  );
}