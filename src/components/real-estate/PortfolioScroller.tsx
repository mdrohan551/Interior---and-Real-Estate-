"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import Pic from "./Pic";
import { MaskText } from "./motion";
import { Icon } from "./icons";
import { BASE, type Project } from "@/lib/real-estate/data";

/** Sticky horizontal-scroll showcase: vertical scroll drives the track sideways. Each card opens a case study. */
export default function PortfolioScroller({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  useEffect(() => {
    const m = () => setDist(Math.max(0, (track.current?.scrollWidth ?? 0) - window.innerWidth));
    m(); window.addEventListener("resize", m); return () => window.removeEventListener("resize", m);
  }, [projects]);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={ref} id="work" style={{ height: `calc(100vh + ${dist}px)` }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="flex w-full items-end justify-between gap-6 px-5 pb-6 md:px-8 lg:px-12 xl:px-16">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#2F7D5B]">Selected work</p>
            <MaskText text="Spaces worth a closer look." className="text-3xl font-semibold leading-[1.08] tracking-tight md:text-5xl" />
            <p className="mt-2.5 max-w-xl text-base sm:text-lg md:text-xl text-[#1F2937]/75">
              An architectural showcase of hand-crafted residences, corporate offices, and boutique hospitality interiors.
            </p>
          </div>
          <Link
            href={`${BASE}/portfolio`}
            className="hidden items-center gap-2 rounded-sm border border-[#1F2937]/15 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#1F2937] transition hover:bg-[#CFEBD9] md:flex"
          >
            All projects <Icon n="arrow" className="h-4 w-4" />
          </Link>
        </div>
        <motion.div ref={track} style={{ x }} className="flex w-max gap-5 px-5 md:px-8 lg:px-12 xl:px-16">
          {projects.map((p) => (
            <Link key={p.slug} href={`${BASE}/portfolio/${p.slug}`} data-cursor="View" className="group block w-[78vw] shrink-0 md:w-[30vw] lg:w-[26vw]">
              <div className="relative aspect-[4/4.6] overflow-hidden rounded-md border border-[#1F2937]/10 bg-white">
                <Pic src={p.img} alt={p.title} sizes="30vw" className="absolute inset-0" imgClassName="transition-transform duration-[900ms] ease-out group-hover:scale-[1.08]" />
                <span className="absolute left-3.5 top-3.5 rounded-sm bg-white/95 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#14402e] shadow-xs backdrop-blur-md">{p.cat}</span>
              </div>
              <div className="mt-3.5 flex items-baseline justify-between gap-3">
                <h3 className="text-lg font-semibold md:text-xl text-[#1F2937]">{p.title}</h3>
                <span className="shrink-0 text-sm text-[#1F2937]/60">{p.place}</span>
              </div>
            </Link>
          ))}
        </motion.div>
        <div className="mt-8 h-[2px] w-full px-5 md:px-8 lg:px-12 xl:px-16">
          <div className="h-full bg-[#1F2937]/10">
            <motion.div style={{ width: bar }} className="h-full bg-[#2F7D5B]" />
          </div>
        </div>
      </div>
    </section>
  );
}
