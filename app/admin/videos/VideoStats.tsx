"use client";

import type { VideoDoc } from "@/types";

interface VideoStatsProps {
  videos: VideoDoc[];
}

export default function VideoStats({
  videos,
}: VideoStatsProps) {
  const total = videos.length;
  const published = videos.filter((v) => v.isPublished).length;
  const draft = total - published;

  const totalDuration = videos.reduce(
    (sum, video) => sum + (video.duration ?? 0),
    0
  );

  const totalHours = (totalDuration / 3600).toFixed(1);

  const Card = ({
    title,
    value,
  }: {
    title: string;
    value: string | number;
  }) => (
    <div className="bg-navy-card rounded-2xl p-5 border border-white/8">
      <p className="text-xs uppercase tracking-wider text-slate-400">
        {title}
      </p>

      <h3 className="text-2xl font-bold text-white mt-2">
        {value}
      </h3>
    </div>
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card title="Videos" value={total} />
      <Card title="Published" value={published} />
      <Card title="Draft" value={draft} />
      <Card title="Hours" value={totalHours} />
    </div>
  );
}