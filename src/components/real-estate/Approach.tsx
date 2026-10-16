"use client";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import Pic from "./Pic";
import { EASE, MaskText } from "./motion";
import { Icon } from "./icons";
import { BASE, TEAMS } from "@/lib/real-estate/data";

/** "Four teams. One standard." Hover (or tap) a team: it opens, the image crossfades. Shows B2C vs B2B focus. */
export default function Approach({ heading = true }: { heading?: boolean }) {
  const [a, setA] = useState(0);
  return (
    <section className="w-full px-5 py-12 md:px-8 md:py-18 lg:px-12 xl:px-16">
      {heading && (
        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#2F7D5B]">The Imagine approach</p>
          <MaskText text="Four teams. One standard." className="text-3xl font-semibold leading-[1.08] tracking-tight md:text-5xl" />
          <p className="mt-4 max-w-2xl text-base sm:text-lg md:text-xl leading-relaxed text-[#1F2937]/75">
            Every project begins with the right people. Each team is built around a different client group, so you work with specialists who understand your world.
          </p>
        </div>
      )}
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <ul className="border-t border-[#1F2937]/15">
          {TEAMS.map((t, i) => (
            <li key={t.n} onMouseEnter={() => setA(i)} className="border-b border-[#1F2937]/15">
              <button type="button" onClick={() => setA(i)} aria-expanded={a === i} className="flex w-full items-center justify-between gap-4 py-5 text-left">
                <span className="flex items-baseline gap-4">
                  <span className="font-mono text-xs text-[#1F2937]/40">0{i + 1}</span>
                  <span className={`text-2xl font-semibold tracking-tight transition-colors md:text-3xl ${a === i ? "text-[#1F2937]" : "text-[#1F2937]/35"}`}>{t.n}</span>
                </span>
                <span className="rounded-sm border border-[#1F2937]/10 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#2F7D5B] shadow-xs">{t.group}</span>
              </button>
              <AnimatePresence initial={false}>
                {a === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: EASE }} className="overflow-hidden">
                    <p className="max-w-lg pb-2 text-sm sm:text-base leading-relaxed text-[#1F2937]/75">{t.d}</p>
                    <p className="pb-4 text-xs sm:text-sm font-semibold text-[#1F2937]/60">{t.lead}</p>
                    <Link href={`${BASE}/portfolio?cat=${t.cat}`} className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2F7D5B] hover:text-[#1F2937]">See their work <Icon n="arrow" className="h-4 w-4" /></Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
        <div className="relative hidden aspect-[4/4.6] overflow-hidden rounded-md border border-[#1F2937]/10 bg-white lg:block">
          <AnimatePresence mode="sync">
            <motion.div key={a} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease: EASE }} className="absolute inset-0">
              <Pic src={TEAMS[a].img} alt={TEAMS[a].n} className="absolute inset-0" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
