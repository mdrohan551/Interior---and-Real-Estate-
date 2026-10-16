"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "./gsap";

export default function CountUp({ to, suffix = "", className }: { to: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const o = { v: 0 };
    el.textContent = `0${suffix}`;
    gsap.to(o, {
      v: to, duration: 2.2, ease: "power1.out",
      scrollTrigger: { trigger: el, start: "top 92%", once: true },
      onUpdate: () => { el.textContent = `${Math.round(o.v)}${suffix}`; },
    });
  }, { scope: ref });
  return <span ref={ref} className={className}>{to}{suffix}</span>;
}
