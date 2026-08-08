"use client";

import { useMemo, useState } from "react";

import { AddVideoModal } from "@/features/videos/components/layout/AddVideoModal";
import { EditVideoModal } from "@/features/videos/components/layout/EditVideoModal";
import { VideosTable } from "@/features/videos/components/VideoForm/VideosTable";
import { useDeleteVideo } from "@/features/videos/hooks/useDeleteVideo";
import { useVideos } from "@/features/videos/hooks/useVideos";
import type { Video } from "@/features/videos/types/video.types";

import {
  Card,
  PrimaryBtn,
  Spinner,
  Toast,
} from "@/components/ui";

type ToastState = {
  msg: string;
  type: "success" | "error";
};

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Video operation failed.";
}

export default function AdminVideosPage() {
  const {
    videos,
    isLoading,
    error,
    reload,
  } = useVideos();
  const { submit: deleteVideo } = useDeleteVideo();
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingVideo, setEditingVideo] =
    useState<Video | null>(null);
  const [toast, setToast] =
    useState<ToastState | null>(null);

  const filteredVideos = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return videos;

    return videos.filter((video) => {
      const haystack = [
        video.title,
        video.description,
        video.status,
        video.provider,
      ].join(" ").toLowerCase();

      return haystack.includes(query);
    });
  }, [videos, search]);

  const publishedCount = videos.filter(
    (video) => video.status === "published"
  ).length;
  const totalHours = (
    videos.reduce(
      (sum, video) => sum + video.durationSeconds,
      0
    ) / 3600
  ).toFixed(1);

  async function handleDelete(video: Video) {
    if (!confirm(`Delete "${video.title}"?`)) return;

    try {
      await deleteVideo(video.id);
      await reload();
      setToast({
        msg: "Video deleted",
        type: "success",
      });
    } catch (err) {
      setToast({
        msg: getErrorMessage(err),
        type: "error",
      });
    }
  }

  return (
    <div className="space-y-6">

      {toast && (
        <Toast
          msg={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <p className="text-xs uppercase tracking-wider text-slate-400">
            Videos
          </p>
          <h3 className="mt-2 text-2xl font-bold text-white">
            {videos.length}
          </h3>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-wider text-slate-400">
            Published
          </p>
          <h3 className="mt-2 text-2xl font-bold text-white">
            {publishedCount}
          </h3>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-wider text-slate-400">
            Draft
          </p>
          <h3 className="mt-2 text-2xl font-bold text-white">
            {videos.length - publishedCount}
          </h3>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-wider text-slate-400">
            Hours
          </p>
          <h3 className="mt-2 text-2xl font-bold text-white">
            {totalHours}
          </h3>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search videos..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-primary-500 sm:w-80"
        />

        <PrimaryBtn onClick={() => setAdding(true)}>
          + Add Video
        </PrimaryBtn>

      </div>

      {error && (
        <Card className="border-red-500/20 bg-red-500/10 text-red-200">
          {error}
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size={40} />
        </div>
      ) : (
        <VideosTable
          videos={filteredVideos}
          onCreate={() => setAdding(true)}
          onEdit={setEditingVideo}
          onDelete={handleDelete}
        />
      )}

      <AddVideoModal
        open={adding}
        onClose={() => setAdding(false)}
        onSaved={async () => {
          await reload();
          setToast({
            msg: "Video created",
            type: "success",
          });
        }}
      />

      {editingVideo && (
        <EditVideoModal
          open={true}
          video={editingVideo}
          onClose={() => setEditingVideo(null)}
          onSaved={async () => {
            await reload();
            setToast({
              msg: "Video updated",
              type: "success",
            });
          }}
        />
      )}

    </div>
  );
}
