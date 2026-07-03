"use client";
import { useState } from "react";
import { CommentInput } from "./CommentInput";
import { CommentCard } from "./CommentCard";
import type { CommentDoc } from "@/types";

interface Props {
  questionId: string;
  comments:   CommentDoc[];
  uid:        string;
  isAdmin?:   boolean;
  onPost:     (text: string) => void;
  onUpvote:   (commentId: string) => void;
  onReport:   (commentId: string) => void;
  onModerate?: (commentId: string, action: "approve" | "delete") => void;
}

export function CommentThread({ comments, uid, isAdmin, onPost, onUpvote, onReport, onModerate }: Props) {
  const [sortBy, setSortBy] = useState<"top" | "new">("top");

  const sorted = [...comments]
    .filter((c) => !c.isDeleted || isAdmin)
    .sort((a, b) => sortBy === "top" ? b.upvotes - a.upvotes : 0);

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-white text-[15px]">💬 Discussion — {comments.length} comments</h3>
        <div className="flex gap-2">
          {(["top","new"] as const).map((v) => (
            <button key={v} onClick={() => setSortBy(v)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all"
              style={{
                background: sortBy === v ? "#2FA084" : "transparent",
                color: sortBy === v ? "#fff" : "#7A99BB",
                borderColor: sortBy === v ? "#2FA084" : "rgba(255,255,255,0.08)",
              }}>
              {v === "top" ? "🔥 Top" : "🕐 Newest"}
            </button>
          ))}
        </div>
      </div>

      <CommentInput onSubmit={onPost} />

      <div className="space-y-3">
        {sorted.map((c) => (
          <CommentCard key={c.id} comment={c}
            isOwnVote={c.upvotedBy.includes(uid)}
            onUpvote={() => onUpvote(c.id)}
            onReport={() => onReport(c.id)}
            isAdmin={isAdmin}
            onModerate={(action) => onModerate?.(c.id, action)}
          />
        ))}
      </div>
    </div>
  );
}
