"use client";
import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { interior } from "@/lib/interior";
import ProjectCard from "./ProjectCard";
import { Arrow } from "./ui";

const STEP = 6;

/** Category filter plus a "Load more" button that reveals the next batch with a layout animation */
export default function PortfolioExplorer() {
  const { categories, items } = interior.portfolio;
  const [cat, setCat] = useState(categories[0]);
  const [count, setCount] = useState(STEP);
  const list = cat === "All" ? items : items.filter((p) => p.category === cat);
  const visible = list.slice(0, count);

  const leftCol = visible.filter((_, i) => i % 2 === 0);
  const rightCol = visible.filter((_, i) => i % 2 === 1);

  return (
    <section className="lv-wrap pb-24 md:pb-32">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-lv-line pb-4">
        <LayoutGroup id="lv-filter">
          <div role="tablist" aria-label="Project category" className="flex gap-1">
            {categories.map((c) => (
              <button key={c} role="tab" aria-selected={cat === c} onClick={() => { setCat(c); setCount(STEP); }}
                className={`relative rounded-full px-5 py-2 text-sm transition-colors ${cat === c ? "text-white" : "text-lv-ink/70 hover:text-lv-ink"}`}>
                {cat === c && <motion.span layoutId="lv-filter-pill" className="absolute inset-0 -z-10 rounded-full bg-lv-ink" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                {c}
              </button>
            ))}
          </div>
        </LayoutGroup>
        <p className="text-sm text-lv-mute" aria-live="polite">Showing {visible.length} of {list.length} projects</p>
      </div>

      {/* Mobile view (< md): clean single column with uniform tight spacing */}
      <div className="mt-10 flex flex-col gap-8 md:hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((p, i) => (
            <motion.div
              key={`m-${p.id}`}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: (i % STEP) * 0.05 }}
            >
              <ProjectCard p={p} reveal={false} aspect={i % 2 === 0 ? "aspect-[4/3]" : "aspect-[16/10]"} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Desktop & Tablet view (>= md): 2-column balanced masonry without large vertical gaps */}
      <div className="mt-12 hidden md:grid md:grid-cols-2 md:gap-8 lg:gap-10 items-start">
        {/* Left Column */}
        <div className="flex flex-col gap-8 lg:gap-10">
          <AnimatePresence mode="popLayout" initial={false}>
            {leftCol.map((p, idx) => (
              <motion.div
                key={`d-left-${p.id}`}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: (idx % STEP) * 0.05 }}
              >
                <ProjectCard p={p} reveal={false} aspect={idx % 2 === 0 ? "aspect-[4/5]" : "aspect-[4/3]"} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-8 lg:gap-10">
          <AnimatePresence mode="popLayout" initial={false}>
            {rightCol.map((p, idx) => (
              <motion.div
                key={`d-right-${p.id}`}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: (idx % STEP) * 0.05 }}
              >
                <ProjectCard p={p} reveal={false} aspect={idx % 2 === 0 ? "aspect-[4/3]" : "aspect-[4/5]"} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {count < list.length && (
        <div className="mt-20 flex justify-center">
          <button onClick={() => setCount((n) => n + STEP)} className="inline-flex h-12 items-center gap-2 rounded-full border border-lv-ink/20 px-8 text-sm transition-colors hover:border-lv-ink">
            Load more<Arrow className="size-4 rotate-90" />
          </button>
        </div>
      )}
    </section>
  );
}

export { PortfolioExplorer };

