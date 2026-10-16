"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "./gsap";

/** Dot + trailing ring. Ring grows and shows a label over any element with data-cursor="Label". Fine pointers only. */
export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  useGSAP(() => {
    const d = dot.current, r = ring.current, l = label.current;
    if (!d || !r || !l) return;
    const mm = gsap.matchMedia();
    mm.add("(pointer: fine)", () => {
      gsap.set([d, r], { xPercent: -50, yPercent: -50, opacity: 1 });
      const dx = gsap.quickTo(d, "x", { duration: 0.1 }), dy = gsap.quickTo(d, "y", { duration: 0.1 });
      const rx = gsap.quickTo(r, "x", { duration: 0.5, ease: "power3" }), ry = gsap.quickTo(r, "y", { duration: 0.5, ease: "power3" });
      const move = (e: MouseEvent) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); };
      const over = (e: MouseEvent) => {
        const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
        l.textContent = t?.dataset.cursor ?? "";
        gsap.to(r, { width: t ? 92 : 40, height: t ? 92 : 40, backgroundColor: t ? "rgba(184,92,73,0.9)" : "rgba(184,92,73,0)", duration: 0.4, ease: "power3.out" });
      };
      window.addEventListener("mousemove", move);
      window.addEventListener("mouseover", over);
      return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", over); };
    });
  }, []);
  return (
    <div aria-hidden className="pointer-coarse:hidden">
      <div ref={ring} className="pointer-events-none fixed left-0 top-0 z-[90] flex h-10 w-10 items-center justify-center rounded-full border border-terra text-[11px] font-semibold uppercase tracking-widest text-white opacity-0">
        <span ref={label} />
      </div>
      <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[91] h-2 w-2 rounded-full bg-terra opacity-0" />
    </div>
  );
}
