"use client";

import { useEffect, useMemo, useState } from "react";

import {
  getVideos,
  getChapters,
  createVideo,
  updateVideo,
  deleteVideo,
} from "@/lib/firebase/firestore";

import { auth } from "@/lib/firebase/config";

import type {
  ChapterDoc,
  VideoDoc,
} from "@/types";

import {
  BLANK_VIDEO,
  type VideoModalState,
} from "./types";

export function useVideos() {
  const [videos, setVideos] = useState<VideoDoc[]>([]);
  const [chapters, setChapters] = useState<ChapterDoc[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [modal, setModal] =
    useState<VideoModalState>(null);

  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  async function load() {
    setLoading(true);

    try {
      const [videoData, chapterData] =
        await Promise.all([
          getVideos(undefined, true),
          getChapters(),
        ]);

      setVideos(videoData);
      setChapters(chapterData);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filteredVideos = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return videos;

    return videos.filter(
      (video) =>
        video.title.toLowerCase().includes(q) ||
        video.instructorName
          .toLowerCase()
          .includes(q)
    );
  }, [videos, search]);
    function openAddModal() {
    setModal({
      mode: "add",
      data: { ...BLANK_VIDEO },
    });
  }

  function openEditModal(video: VideoDoc) {
    setModal({
      mode: "edit",
      data: { ...video },
    });
  }

  function closeModal() {
    setModal(null);
  }

  async function saveVideo(form: Partial<VideoDoc>) {
    try {
      const chapter = chapters.find(
        (c) => c.id === form.chapterId
      );

      const payload: Partial<VideoDoc> = {
        ...form,
        chapterName: chapter?.name ?? "",
      };

      if (modal?.mode === "add") {
        await createVideo({
          ...payload,
          createdBy: auth.currentUser?.uid ?? "",
        });

        setToast({
          msg: "Video created",
          type: "success",
        });
      } else if (
        modal?.mode === "edit" &&
        "id" in modal.data
      ) {
        await updateVideo(
          modal.data.id!,
          payload
        );

        setToast({
          msg: "Video updated",
          type: "success",
        });
      }

      closeModal();

      await load();
    } catch (error) {
      console.error(error);

      setToast({
        msg: "Failed to save video",
        type: "error",
      });
    }
  }

  async function removeVideo(video: VideoDoc) {
    if (!confirm(`Delete "${video.title}"?`))
      return;

    try {
      await deleteVideo(video.id);

      setToast({
        msg: "Video deleted",
        type: "success",
      });

      await load();
    } catch (error) {
      console.error(error);

      setToast({
        msg: "Failed to delete video",
        type: "error",
      });
    }
  }  return {
    videos: filteredVideos,
    chapters,

    loading,

    search,
    setSearch,

    modal,
    toast,

    setToast,

    openAddModal,
    openEditModal,
    closeModal,

    saveVideo,
    removeVideo,

    reload: load,
  };
}