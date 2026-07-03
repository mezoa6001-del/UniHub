"use client";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getChapters, getVideos, getUserVideoProgress, saveVideoProgress } from "@/lib/firebase/firestore";
import { EmptyState, Spinner } from "@/components/ui";
import { formatDuration } from "@/lib/utils/formatters";
import type { ChapterDoc, VideoDoc, VideoProgressDoc } from "@/types";

export default function VideosPage() {
  const { profile } = useAuth();
  const [chapters, setChapters] = useState<ChapterDoc[]>([]);
  const [videos,   setVideos]   = useState<VideoDoc[]>([]);
  const [progMap,  setProgMap]  = useState<Record<string, VideoProgressDoc>>({});
  const [selCh,    setSelCh]    = useState("all");
  const [playing,  setPlaying]  = useState<VideoDoc | null>(null);
  const [loading,  setLoading]  = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const syncRef  = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => { getChapters().then(setChapters); }, []);
  useEffect(() => {
    if (!profile) return;
    setLoading(true);
    Promise.all([getVideos(selCh === "all" ? undefined : selCh), getUserVideoProgress(profile.uid)])
      .then(([vids, prog]) => { setVideos(vids); setProgMap(prog); })
      .finally(() => setLoading(false));
  }, [selCh, profile]);

  const startVideo = (vid: VideoDoc) => {
    setPlaying(vid);
    clearInterval(syncRef.current);
    syncRef.current = setInterval(async () => {
      const v = videoRef.current;
      if (!v || !profile) return;
      await saveVideoProgress(profile.uid, vid.id, Math.floor(v.currentTime), Math.floor(v.duration || vid.duration));
      setProgMap((p) => ({ ...p, [vid.id]: { ...p[vid.id], percentage: Math.round((v.currentTime / (v.duration || vid.duration)) * 100) } as VideoProgressDoc }));
    }, 10000);
  };

  const stopVideo = () => { clearInterval(syncRef.current); setPlaying(null); };

  useEffect(() => () => clearInterval(syncRef.current), []);

  if (playing) {
    const pct = progMap[playing.id]?.percentage ?? 0;
    return (
      <div className="space-y-5">
        <button onClick={stopVideo} className="bg-navy-card border border-white/8 rounded-xl px-4 py-2 text-slate-400 text-sm font-semibold hover:text-white">
          ← Back to Videos
        </button>
        <div className="bg-black rounded-2xl overflow-hidden aspect-video flex items-center justify-center relative">
          {playing.videoUrl
            ? <video ref={videoRef} src={playing.videoUrl} controls autoPlay className="w-full h-full object-contain"
                onLoadedMetadata={() => { if (videoRef.current && progMap[playing.id]?.watchedSeconds) videoRef.current.currentTime = progMap[playing.id].watchedSeconds; }} />
            : <div className="text-center p-8">
                <div className="text-6xl opacity-20 mb-4">🎬</div>
                <p className="text-slate-400 text-sm">Add <code className="text-primary-400">videoUrl</code> in Admin → Videos to play</p>
              </div>
          }
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
            <div className="h-full bg-primary-500 transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="bg-navy-card rounded-2xl p-6 border border-white/8">
          <h2 className="text-lg font-bold text-white mb-2">{playing.title}</h2>
          <p className="text-sm text-slate-400 mb-4">{playing.instructorName} · {formatDuration(playing.duration)} · {playing.viewCount} views</p>
          {playing.description && <p className="text-sm text-slate-300 leading-relaxed mb-4">{playing.description}</p>}
          <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Progress</span><span className="font-bold text-primary-400">{pct}%</span></div>
          <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
            <div className="h-full bg-primary-500 transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
    );
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size={40} /></div>;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3 items-center">
        <select value={selCh} onChange={(e) => setSelCh(e.target.value)}
          className="px-4 py-2 rounded-xl bg-navy-card border border-white/8 text-white text-sm outline-none">
          <option value="all">All Chapters</option>
          {chapters.map((ch) => <option key={ch.id} value={ch.id}>{ch.name}</option>)}
        </select>
        <span className="ml-auto text-sm text-slate-400">{videos.length} videos</span>
      </div>

      {videos.length === 0
        ? <EmptyState icon="🎥" title="No videos yet" desc="Upload videos via Admin → Videos" />
        : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {videos.map((vid) => {
              const pct = progMap[vid.id]?.percentage ?? 0;
              return (
                <div key={vid.id} onClick={() => startVideo(vid)}
                  className="bg-navy-card rounded-2xl overflow-hidden border border-white/8 cursor-pointer hover:-translate-y-1 transition-transform">
                  <div className="h-40 bg-gradient-to-br from-navy to-navy-light flex items-center justify-center relative">
                    <span className="text-5xl">🎬</span>
                    {pct >= 95 && <span className="absolute top-3 right-3 bg-primary-500 text-white text-[11px] font-bold px-3 py-1 rounded-full">✓ Done</span>}
                    {pct > 0 && pct < 95 && <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10"><div className="h-full bg-primary-500" style={{ width: `${pct}%` }} /></div>}
                    <span className="absolute bottom-2 right-3 bg-black/70 text-white text-[11px] font-semibold px-2 py-0.5 rounded">
                      {formatDuration(vid.duration)}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-white text-sm mb-1 leading-snug line-clamp-2">{vid.title}</h3>
                    <p className="text-xs text-slate-400 mb-3">{vid.instructorName} · {vid.viewCount} views</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-white/8 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[11px] text-slate-400 font-semibold">{pct}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      }
    </div>
  );
}
