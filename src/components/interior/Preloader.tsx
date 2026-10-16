"use client";
import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap, useGSAP } from "@/components/motion/gsap";
import Photo from "@/components/ui/Photo";
import { interior, tone } from "@/lib/interior";
import { useInteriorReady } from "./interiorStore";

const KEY = "lv-intro-seen";

/** Intro: two words slide up, an image opens between them, then the curtain lifts. Plays once per session on the home page. */
export default function Preloader() {
  const path = usePathname();
  const setReady = useInteriorReady((s) => s.setReady);
  const [show, setShow] = useState(path === "/interior");
  const root = useRef<HTMLDivElement>(null);
  const [a, b] = interior.preloader.words;

  const preloaderImage =
    (interior.preloader as { image?: string }).image ||
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80&auto=format&fit=crop";

  useGSAP(() => {
    if (!show) { setReady(true); return; }

    const skip = sessionStorage.getItem(KEY) || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (skip) { setShow(false); setReady(true); return; }

    document.documentElement.style.overflow = "hidden";
    const finish = () => {
      sessionStorage.setItem(KEY, "1");
      document.documentElement.style.overflow = "";
      setShow(false);
    };
    gsap.timeline({ defaults: { ease: "power4.inOut" }, onComplete: finish })
      .from(".pl-word", { yPercent: 115, duration: 1, stagger: 0.12, ease: "power4.out" })
      .fromTo(".pl-img", { width: 0 }, { width: "clamp(4.5rem, 11vw, 9rem)", duration: 1.1 }, "-=0.5")
      .to(".pl-word", { yPercent: -115, duration: 0.8, stagger: 0.08 }, "+=0.35")
      .to(".pl-img", { height: 0, duration: 0.8 }, "<")
      .call(() => setReady(true), undefined, "-=0.25")
      .to(root.current, { yPercent: -100, duration: 1, ease: "power4.inOut" }, "-=0.4");
  }, { scope: root, dependencies: [] });

  if (!show) return null;
  return (
    <div ref={root} aria-hidden className="fixed inset-0 z-[300] grid place-items-center bg-white text-neutral-900">
      <div className="flex items-center gap-[clamp(0.5rem,2vw,1.5rem)] text-[clamp(2.2rem,7vw,5rem)] font-light tracking-tight">
        <span className="overflow-hidden py-[0.08em]"><span className="pl-word block">{a}</span></span>
        <span className="pl-img relative block h-[clamp(4.5rem,11vw,9rem)] w-0 overflow-hidden">
          <Photo src={preloaderImage} tone={tone(interior.preloader.tone)} alt="Interior preview" priority className="absolute inset-0" />
        </span>
        <span className="overflow-hidden py-[0.08em]"><span className="pl-word block">{b}</span></span>
      </div>
    </div>
  );
}

export { Preloader };

