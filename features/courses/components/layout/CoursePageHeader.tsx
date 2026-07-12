import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface CoursePageHeaderProps {
  title: string;
  description?: string;
  backHref: string;
  backLabel?: string;
}

export function CoursePageHeader({
  title,
  description,
  backHref,
  backLabel = "Back",
}: CoursePageHeaderProps) {
  return (
    <div className="space-y-4">
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Link>

      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">
          {title}
        </h1>

        {description && (
          <p className="text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}