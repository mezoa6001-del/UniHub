"use client";
import { useEffect, useState } from "react";
import { listVideos } from "@/features/videos/services/list-videos.service";
import type { Video } from "@/features/videos/types/video.types";
import AddVideoModal from "./AddVideoModal";
type CourseVideosTabProps = {
  courseId: string;
};

export default function CourseVideosTab({
  courseId,
}: CourseVideosTabProps) {
  const [openModal, setOpenModal] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVideos() {
    setLoading(true);

    const data = await listVideos(courseId);

    setVideos(data);
    setLoading(false);
  }

  loadVideos();
}, [courseId]);

  return (
    <div className="rounded-3xl border border-white/10 bg-navy-card p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Videos
          </h2>

          <p className="mt-2 text-slate-400">
            Manage course videos.
          </p>
        </div>

        <button
  onClick={() => setOpenModal(true)}
  className="rounded-xl bg-primary-500 px-4 py-2 font-medium text-white"
>
  + Add Video
</button>
      </div>

      {loading ? (
  <div className="mt-8 rounded-2xl border border-dashed border-white/10 p-12 text-center">
    <p className="text-slate-400">Loading videos...</p>
  </div>
) : videos.length === 0 ? (
  <div className="mt-8 rounded-2xl border border-dashed border-white/10 p-12 text-center">
    <h3 className="text-lg font-semibold text-white">
      No videos yet
    </h3>

    <p className="mt-2 text-slate-400">
      Add your first lesson for this course.
    </p>
  </div>
) : (
  <div className="mt-8 space-y-4">
    {videos.map((video) => (
      <div
        key={video.id}
        className="rounded-2xl border border-white/10 bg-[#13243A] p-5"
      >
        <h3 className="text-lg font-semibold text-white">
          {video.title}
        </h3>

        <p className="mt-1 text-sm text-slate-400">
          {video.description}
        </p>

        <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
          <span>{video.status}</span>

          <span>
            {Math.floor(video.durationSeconds / 60)} min
          </span>
        </div>
      </div>
    ))}
  </div>
)}
      <AddVideoModal
  open={openModal}
  onClose={() => setOpenModal(false)}
  courseId={courseId}
/>
    </div>
  );
}