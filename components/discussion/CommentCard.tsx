"use client";
import { initials, relativeTime } from "@/lib/utils/formatters";
import type { CommentDoc } from "@/types";

interface Props {
  comment:    CommentDoc;
  isOwnVote:  boolean;
  onUpvote:   () => void;
  onReport:   () => void;
  isAdmin?:   boolean;
  onModerate?: (action: "approve" | "delete") => void;
}

export function CommentCard({ comment, isOwnVote, onUpvote, onReport, isAdmin, onModerate }: Props) {
  return (
    <div className="bg-navy-card rounded-2xl p-5 border border-white/8" style={{ opacity: comment.isDeleted ? 0.5 : 1 }}>
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary flex items-center justify-center text-[11px] font-extrabold text-white shrink-0">
          {initials(comment.displayName)}
        </div>
        <div className="flex-1">
          <span className="font-bold text-sm text-white">{comment.displayName}</span>
          <span className="text-xs text-slate-500 ml-2">{relativeTime(comment.createdAt as any)}</span>
          {comment.isReported && <span className="ml-2 text-[9px] bg-red-500/15 text-red-400 px-1.5 py-0.5 rounded font-bold">Reported</span>}
        </div>
        {isAdmin && (
          <div className="flex gap-1.5">
            <button onClick={() => onModerate?.("approve")} className="text-[11px] font-semibold px-2 py-1 rounded-md bg-primary-500/15 text-primary-400">✓</button>
            <button onClick={() => onModerate?.("delete")}  className="text-[11px] font-semibold px-2 py-1 rounded-md bg-red-500/15 text-red-400">🗑</button>
          </div>
        )}
      </div>
      <p className="text-sm text-white leading-relaxed mb-3">{comment.text}</p>
      <div className="flex items-center gap-3">
        <button onClick={onUpvote}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{
            background:  isOwnVote ? "#2FA08420" : "transparent",
            border:      `1px solid ${isOwnVote ? "#2FA084" : "rgba(255,255,255,0.08)"}`,
            color:       isOwnVote ? "#2FA084" : "#7A99BB",
          }}>
          👍 {comment.upvotes}
        </button>
        <button onClick={onReport} className="text-xs text-slate-500 hover:text-red-400 ml-auto">🚩 Report</button>
      </div>
    </div>
  );
}
