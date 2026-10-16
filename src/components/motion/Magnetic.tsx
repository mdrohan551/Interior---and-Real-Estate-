"use client";
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "./gsap";

/** Pulls its child toward the cursor (desktop / fine pointers only). */
export default function Magnetic({ children, strength = 0.35, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(pointer: fine)", () => {
      const x = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
      const y = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
      const move = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        x((e.clientX - (r.left + r.width / 2)) * strength);
        y((e.clientY - (r.top + r.height / 2)) * strength);
      };
      const leave = () => { x(0); y(0); };
      el.addEventListener("mousemove", move);
      el.addEventListener("mouseleave", leave);
      return () => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); };
    });
  }, { scope: ref });
  return <div ref={ref} className={`inline-block ${className ?? ""}`}>{children}</div>;
}
