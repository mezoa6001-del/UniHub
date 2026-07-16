"use client";

import Link from "next/link";
import {
  BookOpen,
  HelpCircle,
  Pencil,
  PlayCircle,
  Trash2,
} from "lucide-react";

import { Badge, Card } from "@/components/ui";

import type { Course } from "../../types";

interface CourseCardProps {
  course: Course;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
}

export function CourseCard({
  course,
  onEdit,
  onDelete,
}: CourseCardProps) {
  const published = course.status === "published";

  return (
    <Card
      className="
        min-h-[290px]
        overflow-hidden
        border-white/10
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-primary-500/40
        hover:shadow-2xl
      "
    >
      <Link
        href={`/admin/courses/${course.id}`}
        className="block p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-xl font-bold text-white">
              {course.title}
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              /{course.slug}
            </p>
          </div>

          <Badge color={published ? "#22C55E" : "#F59E0B"}>
            {published ? "● Published" : "● Draft"}
          </Badge>
        </div>

        <p className="mt-5 min-h-[48px] line-clamp-2 text-sm leading-6 text-slate-400">
          {course.description || "No description provided."}
        </p>

        <div className="mt-6 grid grid-cols-3 gap-3 rounded-xl border border-white/5 bg-white/5 p-3">
          <div className="flex flex-col items-center gap-1">
            <BookOpen size={20} className="text-primary-400" />
            <span className="text-lg font-bold text-white">0</span>
            <span className="text-[11px] text-slate-500">
              Chapters
            </span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <PlayCircle size={20} className="text-primary-400" />
            <span className="text-lg font-bold text-white">0</span>
            <span className="text-[11px] text-slate-500">
              Videos
            </span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <HelpCircle size={20} className="text-primary-400" />
            <span className="text-lg font-bold text-white">0</span>
            <span className="text-[11px] text-slate-500">
              Questions
            </span>
          </div>
        </div>
      </Link>

      <div className="flex items-center justify-end gap-2 border-t border-white/5 px-6 py-4">
        <button
          type="button"
          title="Edit Course"
          className="rounded-lg p-2 text-slate-400 transition hover:bg-primary-500/10 hover:text-primary-400"
          onClick={() => onEdit?.(course)}
        >
          <Pencil size={18} />
        </button>

        <button
          type="button"
          title="Delete Course"
          className="rounded-lg p-2 text-red-400 transition hover:bg-red-500/10"
          onClick={() => onDelete?.(course)}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </Card>
  );
}