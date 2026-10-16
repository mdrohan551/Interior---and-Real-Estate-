"use client";
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/components/motion/gsap";

/** Image wrapper: opens with a clip-path wipe and a slow zoom-out. `scrub` ties it to scroll position. */
export default function ClipReveal({
  children, className = "", scrub = false, delay = 0,
}: { children: ReactNode; className?: string; scrub?: boolean; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const st = scrub
      ? { trigger: ref.current, start: "top 92%", end: "top 38%", scrub: 0.6 }
      : { trigger: ref.current, start: "top 88%", once: true };
    gsap.fromTo(ref.current, { clipPath: "inset(0 0 100% 0)" },
      { clipPath: "inset(0 0 0% 0)", ease: scrub ? "none" : "power4.inOut", duration: 1.4, delay, scrollTrigger: st });
    gsap.fromTo(inner.current, { scale: 1.18 },
      { scale: 1, ease: scrub ? "none" : "power3.out", duration: 1.8, delay, scrollTrigger: st });
  }, { scope: ref });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div ref={inner} className="h-full w-full">{children}</div>
    </div>
  );
}

export { ClipReveal };

