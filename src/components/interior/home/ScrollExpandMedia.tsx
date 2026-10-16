"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/components/motion/gsap";

export interface ScrollExpandMediaProps {
  imageSrc?: string;
  imageAlt?: string;
  initialHeading?: string;
  scrollHint?: string;
  expandedHeading?: string;
  expandedSubheading?: string;
}

export default function ScrollExpandMedia({
  imageSrc = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&h=1000&q=80&auto=format&fit=crop",
  imageAlt = "Architectural nature retreat and mist forest",
  initialHeading = "Built to scale",
  scrollHint = "Scroll inside the frame",
  expandedHeading = "Every pixel, everywhere",
  expandedSubheading = "The frame opens up as you scroll and hands the whole stage to your media.",
}: ScrollExpandMediaProps) {
  const containerRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const initialOverlayRef = useRef<HTMLDivElement>(null);
  const initialBadgeRef = useRef<HTMLDivElement>(null);
  const initialTitleRef = useRef<HTMLHeadingElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const finalWrapperRef = useRef<HTMLDivElement>(null);
  const finalBadgeRef = useRef<HTMLDivElement>(null);
  const finalHeadingRef = useRef<HTMLHeadingElement>(null);
  const finalSubRef = useRef<HTMLParagraphElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      const frame = frameRef.current;
      if (!container || !frame) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        if (finalWrapperRef.current) gsap.set(finalWrapperRef.current, { opacity: 1 });
        if (frameRef.current) gsap.set(frameRef.current, { width: "100%", height: "100%", borderRadius: 0 });
        return;
      }

      const getInitialW = () => Math.min(460, window.innerWidth * 0.88);
      const getInitialH = () => Math.min(300, window.innerHeight * 0.44);
      const getTargetW = () => container.clientWidth || window.innerWidth;
      const getTargetH = () => window.innerHeight;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // 1. Initial State: intro dissolution (spread + blur dissolve)
      if (initialBadgeRef.current) {
        tl.to(
          initialBadgeRef.current,
          {
            opacity: 0,
            y: -14,
            filter: "blur(4px)",
            duration: 0.16,
            ease: "power2.out",
          },
          0
        );
      }

      if (initialTitleRef.current) {
        // Letter-drift dissolve
        tl.to(
          ".js-init-word",
          {
            opacity: 0,
            y: -28,
            letterSpacing: "0.08em",
            filter: "blur(10px)",
            stagger: 0.03,
            duration: 0.22,
            ease: "power2.out",
          },
          0
        );
      }

      if (scrollHintRef.current) {
        tl.to(
          scrollHintRef.current,
          {
            opacity: 0,
            y: 20,
            filter: "blur(4px)",
            duration: 0.18,
            ease: "power2.out",
          },
          0
        );
      }

      // Camera viewfinder marks fade out
      tl.to(
        ".js-viewfinder",
        {
          opacity: 0,
          scale: 0.94,
          duration: 0.18,
          ease: "power2.out",
        },
        0
      );

      // 2. Frame expansion to 100vw x 100vh
      tl.fromTo(
        frame,
        {
          width: getInitialW,
          height: getInitialH,
          borderRadius: 16,
        },
        {
          width: getTargetW,
          height: getTargetH,
          borderRadius: 0,
          ease: "power2.inOut",
          duration: 0.82,
        },
        0
      );

      // Slow camera zoom / pull-back
      if (imageWrapperRef.current) {
        tl.fromTo(
          imageWrapperRef.current,
          { scale: 1.18 },
          { scale: 1.0, ease: "power1.out", duration: 0.82 },
          0
        );
      }

      // Deepen the tint as it goes full-screen (keeps the white text readable)
      if (vignetteRef.current) {
        tl.fromTo(
          vignetteRef.current,
          { opacity: 0.2 },
          { opacity: 0.65, ease: "power1.inOut", duration: 0.82 },
          0
        );
      }

      // 3. Title reveal (word-by-word mask rise with de-blur)
      if (finalBadgeRef.current) {
        tl.fromTo(
          finalBadgeRef.current,
          {
            opacity: 0,
            y: 18,
            filter: "blur(6px)",
          },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.2,
            ease: "power2.out",
          },
          0.68
        );
      }

      // Individual words rise from a clip mask
      tl.fromTo(
        ".js-movie-word",
        {
          yPercent: 125,
          opacity: 0,
          filter: "blur(12px)",
        },
        {
          yPercent: 0,
          opacity: 1,
          filter: "blur(0px)",
          stagger: 0.05,
          duration: 0.26,
          ease: "power3.out",
        },
        0.7
      );

      if (finalSubRef.current) {
        tl.fromTo(
          finalSubRef.current,
          {
            opacity: 0,
            y: 22,
            filter: "blur(8px)",
          },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.24,
            ease: "power2.out",
          },
          0.76
        );
      }
    },
    { scope: containerRef }
  );

  const initialWords = initialHeading.split(" ");
  const expandedWords = expandedHeading.split(" ");

  return (
    <section
      ref={containerRef}
      aria-label="Cinematic Media Experience"
      className="relative h-[300vh] w-full text-lv-ink select-none overflow-clip"
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        {/* Same subtle grid as the hero, so the section matches the site background */}
        <div className="lv-hero-grid" aria-hidden="true" />

        {/* Soft ambient glow behind the frame */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 60% 45% at 50% 50%, rgba(15, 34, 48, 0.06), transparent 75%)",
          }}
          aria-hidden="true"
        />

        {/* Initial heading: positioned above the frame */}
        <div
          ref={initialOverlayRef}
          className="absolute bottom-[calc(50%+min(150px,22vh)+18px)] inset-x-0 z-20 flex flex-col items-center justify-end px-4 text-center pointer-events-none will-change-[transform,opacity]"
        >
          {/* Brand kicker */}
          <div
            ref={initialBadgeRef}
            className="mb-3.5 flex items-center gap-2.5 will-change-[transform,opacity]"
          >
            <span className="size-1.5 rounded-full bg-lv-ink" />
            <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.3em] uppercase text-lv-mute">
              Lavish Perspective
            </span>
            <span className="size-1.5 rounded-full bg-lv-ink" />
          </div>

          {/* Heading with word split */}
          <h2
            ref={initialTitleRef}
            aria-label={initialHeading}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-lv-ink"
          >
            {initialWords.map((word, i) => (
              <span
                key={i}
                className="js-init-word inline-block mr-2.5 last:mr-0 will-change-[transform,opacity,filter]"
              >
                {word}
              </span>
            ))}
          </h2>
        </div>

        {/* Expanding Media Frame */}
        <div
          ref={frameRef}
          className="relative z-10 flex items-center justify-center overflow-hidden bg-white shadow-[0_30px_80px_-24px] shadow-lv-ink/40 ring-1 ring-lv-line/70 will-change-[width,height,border-radius]"
          style={{
            width: "min(460px, 88vw)",
            height: "min(300px, 44vh)",
            borderRadius: "16px",
          }}
        >
          {/* Background Image Container */}
          <div ref={imageWrapperRef} className="relative w-full h-full will-change-transform">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="100vw"
              priority={false}
              className="object-cover w-full h-full select-none"
            />

            {/* Tint (theme navy). Light at first, deeper when full-screen so the text stays readable */}
            <div
              ref={vignetteRef}
              className="absolute inset-0 bg-gradient-to-t from-lv-ink/80 via-lv-ink/35 to-lv-ink/55 pointer-events-none"
            />
            {/* Soft edge falloff */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px] shadow-lv-ink/40" />
          </div>

          {/* Camera viewfinder guides (fade out on scroll) */}
          <div className="js-viewfinder absolute inset-4 pointer-events-none z-15 flex flex-col justify-between">
            <div className="flex justify-between items-center text-[10px] font-mono text-white/80 tracking-widest uppercase">
              <span className="flex items-center gap-1.5">
                <span className="inline-block size-1.5 rounded-full bg-red-500 animate-pulse" />
                REC 2.39:1
              </span>
              <span className="text-white/90">4K UHD</span>
            </div>
            <div className="flex justify-between items-center text-[9px] font-mono text-white/70 tracking-wider">
              <span>[ 50MM T1.5 ]</span>
              <span>SCENE 01 / FULL</span>
            </div>
          </div>

          {/* Expanded State: title sequence (fades in when full-screen) */}
          <div
            ref={finalWrapperRef}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 sm:px-12 text-center pointer-events-none"
          >
            {/* Kicker */}
            <div
              ref={finalBadgeRef}
              className="mb-5 flex items-center gap-3 opacity-0 will-change-[transform,opacity,filter]"
            >
              <span className="h-px w-6 sm:w-10 bg-white/60" />
              <span className="text-[10px] sm:text-xs font-medium tracking-[0.35em] uppercase text-white/90">
                The Full Immersion
              </span>
              <span className="h-px w-6 sm:w-10 bg-white/60" />
            </div>

            {/* Main heading with word-by-word mask slide */}
            <h3
              ref={finalHeadingRef}
              aria-label={expandedHeading}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight drop-shadow-[0_6px_28px_rgba(15,34,48,0.55)] max-w-5xl leading-[1.08]"
            >
              {expandedWords.map((word, i) => (
                <span
                  key={i}
                  className="inline-block overflow-hidden py-1 align-top mr-2.5 sm:mr-3.5 last:mr-0"
                >
                  <span className="js-movie-word inline-block will-change-[transform,opacity,filter]">
                    {word}
                  </span>
                </span>
              ))}
            </h3>

            {/* Subheading */}
            <p
              ref={finalSubRef}
              className="mt-5 sm:mt-7 text-sm sm:text-base md:text-xl lg:text-2xl text-white/95 font-normal md:font-medium max-w-2xl leading-relaxed tracking-wide drop-shadow-[0_4px_16px_rgba(15,34,48,0.55)] opacity-0 will-change-[transform,opacity,filter]"
            >
              {expandedSubheading}
            </p>
          </div>
        </div>

        {/* Scroll cue */}
        <div
          ref={scrollHintRef}
          className="absolute bottom-8 sm:bottom-12 inset-x-0 z-20 flex flex-col items-center justify-center gap-2.5 px-4 text-center pointer-events-none will-change-[transform,opacity]"
        >
          <div className="flex items-center gap-2">
            <span className="h-px w-4 bg-lv-ink/25" />
            <p className="text-[10px] sm:text-xs font-mono font-medium tracking-[0.3em] uppercase text-lv-mute">
              {scrollHint}
            </p>
            <span className="h-px w-4 bg-lv-ink/25" />
          </div>

          {/* Scroll indicator */}
          <div className="w-5 h-8 rounded-full border border-lv-ink/25 bg-white/60 flex items-start justify-center p-1.5 shadow-xs">
            <div className="w-1 h-2 bg-lv-ink rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}

export { ScrollExpandMedia };