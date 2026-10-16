"use client";
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "./gsap";

/** Line-by-line "mask" text reveal (each line slides up from behind a clip). */
export default function Mask({
  lines, className, onScroll = false, delay = 0, stagger = 0.12, duration = 1.1,
}: {
  lines: ReactNode[]; className?: string; onScroll?: boolean; delay?: number; stagger?: number; duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(".js-mask", {
      yPercent: 115, duration, stagger, delay, ease: "power4.out",
      scrollTrigger: onScroll ? { trigger: ref.current, start: "top 88%", once: true } : undefined,
    });
  }, { scope: ref });
  return (
    <div ref={ref} className={className}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden py-[0.06em]">
          <span className="js-mask block">{l}</span>
        </span>
      ))}
    </div>
  );
}
