"use client";
import { useState } from "react";

interface Props {
  onSubmit: (text: string) => void;
  placeholder?: string;
}

export function CommentInput({ onSubmit, placeholder = "Add a clinical pearl, mnemonic, or question…" }: Props) {
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim() || text.length > 2000) return;
    onSubmit(text.trim());
    setText("");
  };

  return (
    <div className="bg-navy-card rounded-2xl p-5 border border-white/8">
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={placeholder}
        className="w-full min-h-[88px] px-3.5 py-3 rounded-xl bg-white/5 border border-white/8 text-white text-sm outline-none resize-y" />
      <div className="flex justify-between items-center mt-2.5">
        <span className="text-[11px] text-slate-500">{text.length}/2000 characters</span>
        <button onClick={submit} disabled={!text.trim() || text.length > 2000}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-secondary text-white font-bold text-sm disabled:opacity-40">
          Post Comment
        </button>
      </div>
    </div>
  );
}
