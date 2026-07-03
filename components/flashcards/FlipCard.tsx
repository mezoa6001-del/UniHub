"use client";
import { useState } from "react";

interface Props {
  front: string;
  back:  string;
  onFlip?: (flipped: boolean) => void;
}

export function FlipCard({ front, back, onFlip }: Props) {
  const [flipped, setFlipped] = useState(false);

  const toggle = () => {
    const next = !flipped;
    setFlipped(next);
    onFlip?.(next);
  };

  return (
    <div className="cursor-pointer h-72" onClick={toggle} style={{ perspective: "1000px" }}>
      <div className="relative h-full" style={{ transformStyle: "preserve-3d", transition: "transform 0.5s", transform: flipped ? "rotateY(180deg)" : "none" }}>
        {/* Front */}
        <div className="absolute inset-0 rounded-2xl p-8 flex flex-col items-center justify-center"
          style={{ background: "linear-gradient(135deg,#0F1B2D,#1A3A5C)", border: "1px solid rgba(255,255,255,0.08)", backfaceVisibility: "hidden" }}>
          <p className="text-[10px] font-bold text-secondary tracking-[2px] uppercase mb-4">QUESTION · tap to reveal</p>
          <p className="text-lg text-white text-center leading-relaxed font-medium">{front}</p>
        </div>
        {/* Back */}
        <div className="absolute inset-0 rounded-2xl p-8 flex flex-col items-center justify-center"
          style={{ background: "linear-gradient(135deg,#0d2b1e,#1a4d2e)", border: "1px solid rgba(47,160,132,0.3)", backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          <p className="text-[10px] font-bold text-secondary tracking-[2px] uppercase mb-4">ANSWER</p>
          <p className="text-[15px] text-white text-center leading-relaxed whitespace-pre-line">{back}</p>
        </div>
      </div>
    </div>
  );
}
