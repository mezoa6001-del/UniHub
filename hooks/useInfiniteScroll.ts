"use client";
import { useEffect, useRef } from "react";

export function useInfiniteScroll(callback: () => void, hasMore: boolean) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting && hasMore) callback(); },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [callback, hasMore]);

  return sentinelRef;
}
