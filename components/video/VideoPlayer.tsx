"use client";
import { useRef, useState, useEffect } from "react";
import type { VideoDoc } from "@/types";

interface Props {
  video: VideoDoc;
  initialWatchedSeconds?: number;
  onProgressUpdate?: (watchedSeconds: number, totalSeconds: number) => void;
}

// Provider abstraction layer: routes playback to the correct
// underlying source depending on video.provider (firebase|bunny|vimeo).
export function VideoPlayer({ video, initialWatchedSeconds = 0, onProgressUpdate }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const syncRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [pct, setPct] = useState(0);

useEffect(() => {
  syncRef.current = setInterval(() => {
    const v = videoRef.current;

    if (!v || !v.duration) return;

    const watched = Math.floor(v.currentTime);
    const total = Math.floor(v.duration);

    setPct(Math.round((watched / total) * 100));

    onProgressUpdate?.(watched, total);
  }, 10000);

  return () => {
    if (syncRef.current) {
      clearInterval(syncRef.current);
    }
  };
}, [onProgressUpdate]);

  if (video.provider === "vimeo" && video.externalUrl) {
    return (
      <div className="aspect-video rounded-2xl overflow-hidden bg-black">
        <iframe
          src={`https://player.vimeo.com/video/${video.externalUrl}`}
          className="w-full h-full border-0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // firebase or bunny — both serve a direct/signed video URL
  return (
    <div className="aspect-video rounded-2xl overflow-hidden bg-black relative flex items-center justify-center">
      {video.videoUrl ? (
        <video
          ref={videoRef}
          src={video.videoUrl}
          controls
          autoPlay
          className="w-full h-full object-contain"
          onLoadedMetadata={() => { if (videoRef.current && initialWatchedSeconds) videoRef.current.currentTime = initialWatchedSeconds; }}
        />
      ) : (
        <div className="text-center p-8">
          <div className="text-6xl opacity-20 mb-4">🎬</div>
          <p className="text-slate-400 text-sm">
            Add a <code className="text-primary-400">videoUrl</code> in Admin → Videos to enable playback
            {video.provider === "bunny" && " (Bunny CDN signed URL)"}
          </p>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <div className="h-full bg-primary-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
