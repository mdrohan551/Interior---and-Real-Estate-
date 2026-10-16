"use client";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, useGSAP } from "@/components/motion/gsap";
import Magnetic from "@/components/motion/Magnetic";
import Photo from "@/components/ui/Photo";
import { interior, tone } from "@/lib/interior";
import MaskText from "../MaskText";
import { useInteriorContact, useInteriorReady } from "../interiorStore";
import { Arrow } from "../ui";

import HeroAside, { heroFeatures } from "../HeroAside";

// Short text under the hero title. Change it to your own line.
const heroDescription =
  "We design calm, timeless interiors that turn every home into a place you love coming back to.";

export default function HomeHero() {
  const h = interior.hero;
  // Hero image array: [0] shows by default, [1] is revealed by the split effect when the mouse moves.
  // Your own photos: put paths here, e.g. [h.image.src, "/photos/living-2.jpg"] or ["/photos/a.jpg", "/photos/b.jpg"].
  // Only the first two are used (extra items are ignored).
  const heroImages: string[] = [
    h.image.src,
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&h=1000&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&h=1000&q=80&auto=format&fit=crop",
  ];
  const root = useRef<HTMLElement>(null);
  const show = useInteriorContact((s) => s.show);
  const ready = useInteriorReady((s) => s.ready);

  useGSAP(() => {
    if (!ready || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(".hero-fade", { opacity: 0, y: 18, duration: 1, stagger: 0.12, delay: 0.5, ease: "power3.out" });
    gsap.fromTo(".hero-frame", { clipPath: "inset(12% 8% 12% 8%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, delay: 0.25, ease: "power4.inOut" });
    // .hero-img is the <Image> inside Photo; the cutout mask sits on Photo's outer div and never moves.
    // Intro: image zooms in from 1.25 and settles at scale 1, so the full photo is visible.
    gsap.fromTo(".hero-img", { scale: 1.25 }, { scale: 1, duration: 2, delay: 0.25, ease: "power3.out" });
    // Scroll "sticky" feel: the frame (photo + cutout + buttons) stays exactly in place,
    // only the image INSIDE the mask slowly slides down and zooms a little while scrolling,
    // so it looks like the image is stuck/held inside the frame.
    // Zoom (1 -> 1.2) gives ~10% overscan per side, enough to cover the 8% slide so no gaps show.
    // Increase yPercent (keep it below ~ (scale-1)/2*100) for a stronger effect.
    gsap.fromTo(
      ".hero-img",
      { yPercent: 0, scale: 1 },
      {
        yPercent: 8,
        scale: 1.2,
        ease: "none",
        immediateRender: false,
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      }
    );
  }, { scope: root, dependencies: [ready] });

  return (
    <section
      ref={root}
      className="relative w-full overflow-hidden pb-0 pt-28 md:pb-24 md:pt-32"
    >
      <div className="lv-hero-grid" aria-hidden="true" />

      <div className="relative z-10 flex w-full flex-col gap-8 px-5 md:flex-row md:gap-0 md:px-8 lg:px-12 xl:px-16">
        <HeroAside
          waitForIntro
          showStats
          className="sticky"
        />

        <div className="flex min-w-0 flex-1 flex-col md:pl-8 lg:pl-14">
          {/* Title + short description. The portfolio badge sits right after the last title line. */}
          <div className="min-w-0">
            <h1 className="lv-display" aria-label={h.titleLines.join(" ")}>
              {h.titleLines.map((l, i) => {
                const line = (
                  <MaskText key={l} as="span" text={l} onScroll={false} waitForIntro delay={i * 0.12} className="block" />
                );
                if (i !== h.titleLines.length - 1) return line;

                return (
                  <span key={l} className="flex flex-wrap items-center gap-x-0 gap-y-2 ">
                    {line}

                    {/* Circular badge button for portfolio */}
                    <Link
                      href={h.secondaryCta.href}
                      className={`hero-fade group relative -my-2 flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-black ring-1 ring-lv-line/70 transition-colors duration-300 hover:bg-lv-ink hover:text-white  lg:size-15 ${ready ? "" : "invisible"}`}
                    >
                      <svg
                        viewBox="0 0 100 100"
                        className="absolute inset-0 h-full w-full origin-center animate-[spin_10s_linear_infinite]"
                      >
                        <path
                          id="circle-path"
                          fill="none"
                          d="M 50, 50 m -32, 0 a 32,32 0 1,1 64,0 a 32,32 0 1,1 -64,0"
                        />
                        <text fill="currentColor" className="text-sm font-extralight uppercase tracking-[0.15em]">
                          <textPath href="#circle-path" startOffset="0%">
                            {h.secondaryCta.label} • {h.secondaryCta.label} •
                          </textPath>
                        </text>
                      </svg>

                      <Arrow className="relative z-10 size-4 -rotate-45 transition-transform duration-300 group-hover:scale-110 md:size-5 lg:size-6" />
                    </Link>
                  </span>
                );
              })}
            </h1>
            <p className={`hero-fade mt-4 max-w-lg text-[15px] sm:text-base md:text-lg lg:text-[19px] font-normal md:font-medium leading-relaxed text-neutral-700 md:text-lv-ink/80 ${ready ? "" : "invisible"}`}>
              {heroDescription}
            </p>
          </div>


          {/* hero-frame: stays still. Photo (outer div) holds the cutout mask, only the inner image moves. */}
          <div className={`hero-frame relative mt-1 w-full rounded-md ${ready ? "" : "invisible"}`}>
            <Photo
              src={heroImages[0] || undefined}
              images={heroImages}
              splitImage
              tone={tone(h.image.tone)}
              alt={h.image.alt}
              className="aspect-[16/7] w-full"
              imageClassName="hero-img"
              priority
              sizes="(min-width:768px) calc(100vw - 280px), 100vw"
              cornersInvert
            />

            {/* Buttons live inside the top-right cutout on phone AND desktop (same place, smaller on phone) */}
            <div className="hero-fade absolute -top-2 right-6 sm:right-0 sm:top-0 z-20 flex h-10 items-center   md:h-12  md:pr-5">
              <Magnetic strength={0}>
                <button
                  onClick={show}
                  className="inline-flex h-7 w-auto sm:w-37.5  items-center justify-center gap-1.5 rounded-md sm:rounded-2xl bg-lv-ink px-2 text-xs text-white transition-colors hover:bg-white hover:text-lv-ink  hover:ring-1 hover:ring-lv-ink/20 md:h-12 md:w-[195px] md:gap-2 md:px-4 md:text-sm"
                >
                  {h.cta}<Arrow className="size-3.5 md:size-4 hidden sm:block" />
                </button>

              </Magnetic>

            </div>
          </div>

          <div className="hero-fade mt-6 divide-y divide-lv-line/70 rounded-md border border-lv-line/70 bg-white/70 p-4 backdrop-blur-xs md:hidden">
            {heroFeatures.map((item) => (
              <Link key={item.title} href={item.href} className="group flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-lv-ink">{item.title}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex -space-x-1">
                      {item.thumbs.map((thumb, i) => (
                        <div key={i} className="relative h-4 w-6 overflow-hidden rounded-full ring-1 ring-white">
                          <Image src={thumb} alt="" fill className="object-cover" sizes="24px" />
                        </div>
                      ))}
                    </div>
                    <span className="text-[11px] text-lv-mute">{item.date}</span>
                  </div>
                </div>
                <svg viewBox="0 0 16 16" className="size-4 text-lv-ink/60" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M6 3.5l4.5 4.5L6 12.5" />
                </svg>
              </Link>
            ))}
          </div>

          <p className="mt-2 sm:mt-4 text-xs text-lv-mute md:hidden">{h.agency}. {h.agencyText}</p>


        </div>
      </div>
    </section>
  );
}

export { HomeHero };