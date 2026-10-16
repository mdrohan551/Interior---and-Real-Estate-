"use client";
import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import Photo from "@/components/ui/Photo";
import { interior, tone } from "@/lib/interior";
import ClipReveal from "./ClipReveal";
import { useInteriorContact } from "./interiorStore";

export default function AboutTabs() {
  const { tabs, image } = interior.about;
  const [id, setId] = useState(tabs[0].id);
  const show = useInteriorContact((s) => s.show);
  const t = tabs.find((x) => x.id === id) ?? tabs[0];

  return (
    <section className="lv-wrap grid gap-12 pb-24 md:grid-cols-12 md:gap-8 md:pb-36">
      <ClipReveal className="rounded-sm md:col-span-6">
        <div className="relative aspect-[4/5]"><Photo src={image.src || undefined} tone={tone(image.tone)} alt={image.alt} className="absolute inset-0" sizes="(min-width:768px) 50vw, 100vw" /></div>
      </ClipReveal>
      <div className="md:col-span-5 md:col-start-8">
        <LayoutGroup id="lv-about">
          <div role="tablist" className="flex flex-wrap gap-x-7 border-b border-lv-line">
            {tabs.map((x) => (
              <button key={x.id} role="tab" id={`tab-${x.id}`} aria-selected={x.id === id} aria-controls="about-panel" onClick={() => setId(x.id)}
                className={`relative pb-3 text-sm transition-colors ${x.id === id ? "text-lv-ink" : "text-lv-mute hover:text-lv-ink"}`}>
                {x.title}
                {x.id === id && <motion.span layoutId="lv-about-line" className="absolute inset-x-0 -bottom-px h-px bg-lv-ink" />}
              </button>
            ))}
          </div>
        </LayoutGroup>
        <div id="about-panel" role="tabpanel" aria-labelledby={`tab-${t.id}`} className="min-h-[22rem] pt-10">
          <AnimatePresence mode="wait">
            <motion.div key={t.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
              <h2 className="lv-h2">{t.heading}</h2>
              {t.body.split("\n\n").map((p) => <p key={p} className="mt-5 max-w-lg text-[15px] sm:text-base md:text-lg font-normal md:font-medium leading-relaxed text-neutral-600 md:text-neutral-700">{p}</p>)}
              <ul className="mt-8 divide-y divide-lv-line border-y border-lv-line text-sm">
                {t.bullets.map((b) => <li key={b} className="py-3">{b}</li>)}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
        <button onClick={show} className="mt-6 inline-flex h-12 items-center rounded-md bg-lv-ink px-7 text-sm text-white transition-colors hover:bg-lv-deep">Book Consultation</button>
      </div>
    </section>
  );
}

export { AboutTabs };

