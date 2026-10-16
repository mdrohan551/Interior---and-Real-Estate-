"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Photo from "@/components/ui/Photo";
import { interior, tone } from "@/lib/interior";
import MaskText from "../MaskText";
import { Arrow, SectionHead } from "../ui";

export default function Testimonials() {
  const list = interior.testimonials;
  const s = interior.sections.testimonials;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const t = list[i];
  const go = (n: number) => setI((n + list.length) % list.length);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((v) => (v + 1) % list.length), 7000);
    return () => clearInterval(id);
  }, [paused, list.length]);

  return (
    <section className="lv-wrap py-2 md:py-15" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <SectionHead label={s.label} title={<MaskText text={s.title} className="lv-h2 max-w-2xl" />} />
      <div className="mt-14 grid overflow-hidden rounded-sm bg-lv-panel md:grid-cols-12">
        <div className="relative aspect-[4/3] md:col-span-5 md:aspect-auto md:min-h-[26rem]">
          <AnimatePresence mode="popLayout">

            <motion.div key={t.id} initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0">
              {(() => {
                const image = (t as { image?: string }).image;
                return (
                  <>
                    <Photo src={image} tone={tone(t.tone)} alt={`${t.name}, ${t.role}`} className="absolute inset-0" />
                    {!image && (
                      <span className="absolute inset-0 grid place-items-center text-6xl font-light text-white/80">{t.initials}</span>
                    )}
                  </>
                );
              })()}
            </motion.div>
          </AnimatePresence>
        </div>
        <figure className="flex flex-col justify-between gap-10 p-8 md:col-span-7 md:p-14">
          <div className="min-h-44" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.blockquote key={t.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.5 }} className="lv-h2 !text-[clamp(1.4rem,2.3vw,2rem)] !leading-snug">
                “{t.quote}”
              </motion.blockquote>
            </AnimatePresence>
          </div>
          <div className="flex items-end justify-between gap-6">
            <figcaption><p>{t.name}</p><p className="text-sm text-lv-mute">{t.role}</p></figcaption>
            <div className="flex items-center gap-2">
              <button onClick={() => go(i - 1)} aria-label="Previous testimonial" className="grid size-11 place-items-center rounded-full border border-lv-ink/15 transition-colors hover:border-lv-ink"><Arrow className="size-4 rotate-180" /></button>
              <button onClick={() => go(i + 1)} aria-label="Next testimonial" className="grid size-11 place-items-center rounded-full border border-lv-ink/15 transition-colors hover:border-lv-ink"><Arrow className="size-4" /></button>
            </div>
          </div>
        </figure>
      </div>
    </section>
  );
}

export { Testimonials };

