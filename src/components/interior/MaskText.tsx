"use client";
import { useRef, type ElementType } from "react";
import { gsap, useGSAP } from "@/components/motion/gsap";
import { useInteriorReady } from "./interiorStore";

/** Word-by-word mask reveal. Wraps naturally, so it works for any heading length. */
export default function MaskText({
  text, as = "h2", className = "", onScroll = true, delay = 0, waitForIntro = false,
}: {
  text: string; as?: ElementType; className?: string; onScroll?: boolean; delay?: number; waitForIntro?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const ready = useInteriorReady((s) => s.ready);
  const Tag = as as ElementType;
  const hold = waitForIntro && !ready;

  useGSAP(() => {
    if (hold || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(".js-w", {
      yPercent: 115, duration: 1.1, stagger: 0.04, delay, ease: "power4.out",
      scrollTrigger: onScroll ? { trigger: ref.current, start: "top 88%", once: true } : undefined,
    });
  }, { scope: ref, dependencies: [hold] });

  return (
    <Tag ref={ref} aria-label={text} className={`${className} ${hold ? "invisible" : ""}`}>
      {text.split(" ").map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden py-[0.06em] align-top">
          <span className="js-w inline-block">{w}&nbsp;</span>
        </span>
      ))}
    </Tag>
  );
}

export { MaskText };

