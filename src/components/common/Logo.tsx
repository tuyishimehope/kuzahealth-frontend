import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoProps {
  /** "light" for dark backgrounds, "dark" for light backgrounds */
  tone?: "light" | "dark";
  className?: string;
  to?: string;
}

/** KuzaHealth wordmark: a mother-and-child mark plus the product name. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={cn("h-6 w-6", className)}>
      <circle cx="9" cy="9" r="6.5" fill="currentColor" />
      <circle cx="17" cy="15.5" r="4" fill="currentColor" opacity="0.55" />
    </svg>
  );
}

export default function Logo({ tone = "dark", className, to = "/" }: LogoProps) {
  return (
    <Link
      to={to}
      className={cn(
        "inline-flex items-center gap-2 font-display text-[15px] font-semibold tracking-tight",
        tone === "light" ? "text-white" : "text-foreground",
        className
      )}
    >
      <LogoMark className={tone === "light" ? "text-white" : "text-primary"} />
      KuzaHealth
    </Link>
  );
}
