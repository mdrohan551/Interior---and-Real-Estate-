"use client";
import { useRef, type ReactNode, type Ref } from "react";
import { gsap, useGSAP } from "./gsap";

type Tag = "div" | "p" | "h1" | "h2" | "h3" | "section" | "ul" | "li" | "figure";

/** Fades + lifts an element (or its children when `stagger` is set) once, when it scrolls into view. */
export default function Reveal({
  children, as = "div", className, y = 24, duration = 1.6, delay = 0, stagger = 0,
}: {
  children: ReactNode; as?: Tag; className?: string; y?: number; duration?: number; delay?: number; stagger?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);
  useGSAP(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(stagger ? Array.from(el.children) : el, {
      opacity: 0, y, duration, delay, stagger, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  }, { scope: ref });
  const Comp = as as "div";
  return <Comp ref={ref as Ref<HTMLDivElement>} className={className}>{children}</Comp>;
}
