"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Clock3,
  Pencil,
  PlayCircle,
  Trash2,
  Eye,
} from "lucide-react";

import { Badge, Card } from "@/components/ui";

import type { Video } from "../types/video.types";

interface VideoCardProps {
  video: Video;
  onEdit?: (video: Video) => void;
  onDelete?: (video: Video) => void;
}

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  return `${m}:${String(s).padStart(2, "0")}`;
}

export function VideoCard({
  video,
  onEdit,
  onDelete,
}: VideoCardProps) {
  const published = video.status === "published";

  return (
    <Card
      className="
        overflow-hidden
        border-white/10
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-primary-500/40
        hover:shadow-2xl
      "
    >
      <Link href={`/admin/videos/${video.id}`}>
        <div className="relative aspect-video overflow-hidden bg-slate-900">
          {video.thumbnailUrl ? (
            <Image
              src={video.thumbnailUrl}
              alt={video.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <PlayCircle
                size={56}
                className="text-slate-500"
              />
            </div>
          )}

          <div className="absolute right-3 top-3">
            <Badge color={published ? "#22C55E" : "#F59E0B"}>
              {published ? "Published" : "Draft"}
            </Badge>
          </div>

          {video.isFreePreview && (
            <div className="absolute left-3 top-3">
              <Badge color="#3B82F6">
                Free Preview
              </Badge>
            </div>
          )}
        </div>

        <div className="space-y-4 p-5">
          <div>
            <h3 className="line-clamp-1 text-lg font-bold text-white">
              {video.title}
            </h3>

            <p className="mt-2 line-clamp-2 text-sm text-slate-400">
              {video.description || "No description provided."}
            </p>
          </div>

          <div className="flex items-center justify-between text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Clock3 size={16} />
              {formatDuration(video.durationSeconds)}
            </div>

            <div>
              #{video.order}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Badge color="#6366F1">
              {video.provider}
            </Badge>

            <div className="flex items-center gap-1 text-slate-400">
              <Eye size={16} />
              Preview
            </div>
          </div>
        </div>
      </Link>

      <div className="flex items-center justify-end gap-2 border-t border-white/5 px-5 py-4">
        <button
          type="button"
          title="Edit Video"
          className="rounded-lg p-2 text-slate-400 transition hover:bg-primary-500/10 hover:text-primary-400"
          onClick={() => onEdit?.(video)}
        >
          <Pencil size={18} />
        </button>

        <button
          type="button"
          title="Delete Video"
          className="rounded-lg p-2 text-red-400 transition hover:bg-red-500/10"
          onClick={() => onDelete?.(video)}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </Card>
  );
}