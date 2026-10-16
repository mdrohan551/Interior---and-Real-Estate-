"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import OpenLead from "./OpenLead";
import { CARD, EASE, MaskText, ScrollReveal, StaggeredGrid, StaggerItem } from "./motion";
import { Icon } from "./icons";
import { FAQS, SITE } from "@/lib/real-estate/data";

/** Accordion: AnimatePresence animates height 0 <-> auto and opacity. */
export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="w-full px-5 py-12 md:px-8 md:py-18 lg:px-12 xl:px-16">
      <div className="mb-10 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#2F7D5B]">FAQ</p>
        <MaskText text="Frequently asked questions" className="text-3xl font-semibold tracking-tight md:text-5xl" />
        <p className="mt-2.5 max-w-xl mx-auto text-base sm:text-lg md:text-xl text-[#1F2937]/75 font-normal">
          Everything you need to know about our architectural philosophy, pricing estimates, and handover guarantees.
        </p>
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-[1.6fr_1fr]">
        <StaggeredGrid className="space-y-3">
          {FAQS.map(([q, a], i) => {
            const o = open === i;
            return (
              <StaggerItem key={q}>
                <div className={CARD}>
                  <button type="button" aria-expanded={o} onClick={() => setOpen(o ? null : i)} className="flex w-full items-center justify-between gap-4 p-4 text-left md:p-5">
                    <span className="text-base sm:text-lg md:text-xl font-semibold text-[#1F2937]">{q}</span>
                    <motion.span animate={{ rotate: o ? 45 : 0 }} transition={{ duration: 0.25 }} className="grid h-8 w-8 shrink-0 place-items-center rounded-sm bg-[#E8F3ED] text-[#2F7D5B]"><Icon n="plus" className="h-3.5 w-3.5" /></motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {o && (
                      <motion.div key="a" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} className="overflow-hidden">
                        <p className="px-4 pb-5 pr-10 text-sm sm:text-base md:text-[17px] leading-relaxed text-[#1F2937]/75 md:px-5">{a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </StaggerItem>
            );
          })}
        </StaggeredGrid>
        <ScrollReveal delay={0.2} className="rounded-md border border-[#2F7D5B]/25 bg-[#CFEBD9] p-6 md:p-8 lg:sticky lg:top-24">
          <h3 className="text-xl font-bold text-[#14402e] md:text-2xl">Still need help?</h3>
          <p className="mt-2 text-sm sm:text-base leading-relaxed text-[#14402e]/80">Talk to our team and get answers tailored to your project.</p>
          <OpenLead className="mt-5 w-full rounded-sm bg-[#1F2937] py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#2F7D5B]">Book a free consultation</OpenLead>
          <a href={SITE.tel} className="mt-2.5 flex items-center justify-center gap-2 rounded-sm border border-[#14402e]/20 bg-white/80 py-3 text-xs font-semibold uppercase tracking-wider text-[#14402e] transition hover:bg-white"><Icon n="phone" className="h-3.5 w-3.5" />{SITE.phone}</a>
        </ScrollReveal>
      </div>
    </section>
  );
}
