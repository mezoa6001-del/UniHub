"use client";

import { Search } from "lucide-react";

interface CourseFiltersProps {
  search: string;
  status: "all" | "draft" | "published";

  onSearchChange: (value: string) => void;
  onStatusChange: (value: "all" | "draft" | "published") => void;
}

export function CourseFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: CourseFiltersProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="relative flex-1">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
        />

        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search courses..."
          className="h-11 w-full rounded-xl border border-white/10 bg-navy-card pl-10 pr-4 text-white outline-none transition focus:border-primary-500"
        />
      </div>

      <select
        value={status}
        onChange={(e) =>
          onStatusChange(
            e.target.value as "all" | "draft" | "published"
          )
        }
        className="h-11 rounded-xl border border-white/10 bg-navy-card px-4 text-white outline-none"
      >
        <option value="all">All Courses</option>
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select>
    </div>
  );
}