"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import Link from "next/link";
import { Icon } from "./icons";
import { EASE } from "./motion";
import { BASE, IMG } from "@/lib/real-estate/data";

function HeroWord({ w, p, a, b }: { w: string; p: MotionValue<number>; a: number; b: number }) {
  const o = useTransform(p, [a, b], [0.35, 1]);
  return (
    <motion.span style={{ opacity: o }} className="mr-[0.25em] inline-block text-white transition-opacity">
      {w}
    </motion.span>
  );
}

function HeroWordScroll({ text, progress, className = "" }: { text: string; progress: MotionValue<number>; className?: string }) {
  const words = text.split(" ");
  return (
    <p className={className}>
      {words.map((w, i) => (
        <HeroWord
          key={i}
          w={w}
          p={progress}
          a={(i / words.length) * 0.22}
          b={((i + 1) / words.length) * 0.22 + 0.04}
        />
      ))}
    </p>
  );
}

/**
 * Editorial Hero:
 * - Statement on top-right: scroll-illuminates, stays pinned & 100% visible with the video.
 * - Title positioned at the bottom: scrolls up over the sticky video, then exits.
 * - At the end of the scroll, the video scales down & recedes into depth ("vitore chole geche").
 */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // 1. Title scrolls up over the sticky video, then exits
  const titleY = useTransform(scrollYProgress, [0, 0.45], ["0vh", "-38vh"]);
  const titleOpacity = useTransform(scrollYProgress, [0.28, 0.45], [1, 0]);

  // 2. Video recedes into depth ("vitore chole geche") as hero finishes
  const videoScale = useTransform(scrollYProgress, [0.35, 0.85], [1, 0.88]);
  const videoRadius = useTransform(scrollYProgress, [0.35, 0.85], ["8px", "28px"]);
  const videoOpacity = useTransform(scrollYProgress, [0.45, 0.85], [1, 0.72]);
  const videoShadow = useTransform(
    scrollYProgress,
    [0.35, 0.85],
    ["0 0 0 rgba(0,0,0,0)", "0 30px 60px -15px rgba(0,0,0,0.85)"]
  );

  const statementText =
    "Imagine Interiors partners with homeowners, businesses, and professional teams to create world-class spaces. Combining market-leading design and exceptional delivery to embed confidence at every stage of a project.";

  return (
    <section ref={ref} id="top" className="relative h-[200vh] bg-[#0A0E0C]">
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 flex h-[100svh] w-full items-center justify-center p-2 sm:p-3 overflow-hidden">

        {/* Animated Cinema Canvas (scales down and recedes inside with depth) */}
        <motion.div
          style={{
            scale: videoScale,
            borderRadius: videoRadius,
            opacity: videoOpacity,
            boxShadow: videoShadow,
          }}
          className="relative flex h-full w-full flex-col justify-between overflow-hidden border border-white/20 p-6 pt-24 sm:p-10 sm:pt-28 md:p-14 md:pt-32 lg:p-16 lg:pt-36 will-change-transform"
        >
          {/* Background Looping Video */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              poster={IMG.hero}
              className="absolute inset-0 h-full w-full object-cover scale-105"
            >
              <source src="/video/download.mp4" type="video/mp4" />
              <source src="/video/emonvai.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Cinematic contrast gradient overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60" />

          {/* Top-Right: Statement & Link - Scroll-illuminates and stays completely visible & still with the video */}
          <div className="relative z-10 flex justify-end">
            <div className="max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl text-right sm:text-left">
              <HeroWordScroll
                text={statementText}
                progress={scrollYProgress}
                className="text-sm font-medium leading-relaxed text-white/95 sm:text-base md:text-lg lg:text-xl xl:text-[22px] xl:leading-[1.4]"
              />
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.55 }}
              >
                <Link
                  href={`${BASE}/about`}
                  className="group mt-4 inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:text-[#CFEBD9] sm:mt-5 sm:text-sm md:text-base"
                >
                  <span className="border-b border-white/50 pb-0.5 transition-colors group-hover:border-white">
                    The Imagine Approach
                  </span>
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-[#1F2937] transition-all duration-300 group-hover:translate-x-1 group-hover:bg-[#CFEBD9]">
                    <Icon n="arrow" className="h-3 w-3" />
                  </span>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Bottom-Left: Headline (positioned down, scrolls up over sticky video) */}
          <motion.div
            style={{ y: titleY, opacity: titleOpacity }}
            className="relative z-10 mt-auto pb-2 sm:pb-4 md:pb-6 lg:pb-8 will-change-transform"
          >
            <h1
              className="text-[2.6rem] font-semibold leading-[0.98] tracking-[-0.035em] text-white sm:text-[4.2rem] md:text-[5.5rem] lg:text-[6.8rem] xl:text-[7.6rem]"
              aria-label="Creation & confidence. Without compromise."
            >
              <span className="block overflow-hidden pb-1">
                <motion.span
                  className="block"
                  initial={{ y: "115%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.95, ease: EASE, delay: 0.2 }}
                >
                  Creation &amp; confidence.
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-1">
                <motion.span
                  className="block"
                  initial={{ y: "115%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.95, ease: EASE, delay: 0.35 }}
                >
                  Without compromise.
                </motion.span>
              </span>
            </h1>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
