"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Pic from "./Pic";
import { EASE, MaskText } from "./motion";
import { Icon } from "./icons";
import { IMG } from "@/lib/real-estate/data";

const GALLERY_ITEMS = [
  {
    id: "g1",
    title: "Minimalist Master Bedroom",
    cat: "Bedrooms",
    place: "Gulshan-2, Dhaka",
    area: "450 sq.ft",
    img: IMG.hero,
  },
  {
    id: "g2",
    title: "Double-Height Duplex Living",
    cat: "Living",
    place: "Baridhara DOHS, Dhaka",
    area: "820 sq.ft",
    img: IMG.living,
  },
  {
    id: "g3",
    title: "Scandinavian Island Kitchen",
    cat: "Kitchens",
    place: "Banani, Dhaka",
    area: "320 sq.ft",
    img: IMG.kitchen,
  },
  {
    id: "g4",
    title: "Architectural Duplex Staircase",
    cat: "Duplex",
    place: "Kushtia Villa",
    area: "4,600 sq.ft",
    img: IMG.duplex,
  },
  {
    id: "g5",
    title: "Executive Collaborative Office",
    cat: "Commercial",
    place: "Tejgaon Commercial Area",
    area: "5,400 sq.ft",
    img: IMG.office,
  },
  {
    id: "g6",
    title: "Boutique Artisan Cafe",
    cat: "Commercial",
    place: "Dhanmondi, Dhaka",
    area: "2,200 sq.ft",
    img: IMG.restaurant,
  },
  {
    id: "g7",
    title: "Warm Contemporary Suite",
    cat: "Bedrooms",
    place: "Uttara Sector 4",
    area: "400 sq.ft",
    img: IMG.bedroom,
  },
  {
    id: "g8",
    title: "Spa-Inspired En-Suite",
    cat: "Living",
    place: "Bashundhara R/A",
    area: "210 sq.ft",
    img: IMG.bathroom,
  },
];

const CATS = ["All", "Living", "Bedrooms", "Kitchens", "Duplex", "Commercial"] as const;
type GalleryCat = (typeof CATS)[number];

const STATS = [
  { label: "Handcrafted Projects", val: "350+" },
  { label: "On-Time Handover", val: "100%" },
  { label: "Dhaka & Regional Coverage", val: "08 Cities" },
  { label: "Structural Warranty", val: "10 Years" },
];

export default function ImageGallery() {
  const [activeCat, setActiveCat] = useState<GalleryCat>("All");
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const filtered = activeCat === "All"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.cat === activeCat);

  const selectedItem = selectedIdx !== null ? filtered[selectedIdx] : null;

  const nextImage = () => {
    if (selectedIdx === null) return;
    setSelectedIdx((selectedIdx + 1) % filtered.length);
  };

  const prevImage = () => {
    if (selectedIdx === null) return;
    setSelectedIdx((selectedIdx - 1 + filtered.length) % filtered.length);
  };

  return (
    <section className="w-full px-5 py-12 md:px-8 md:py-18 lg:px-12 xl:px-16">
      {/* Editorial Header */}
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#2F7D5B]">Visual Portfolio</p>
          <MaskText text="Spaces captured in detail." className="max-w-2xl text-3xl font-semibold leading-[1.08] tracking-tight md:text-5xl" />
        </div>
        <p className="max-w-xl text-base sm:text-lg md:text-xl leading-relaxed text-[#1F2937]/75">
          A showcase of bespoke residential living, executive workspaces, and hospitality interiors executed across Bangladesh.
        </p>
      </div>

      {/* Filter Tabs - Interior editorial style */}
      <div className="mb-8 flex flex-wrap items-center gap-2 border-b border-[#1F2937]/10 pb-4">
        {CATS.map((cat) => {
          const active = activeCat === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setActiveCat(cat);
                setSelectedIdx(null);
              }}
              className={`rounded-sm px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                active
                  ? "bg-[#2F7D5B] text-white shadow-xs"
                  : "bg-white text-[#1F2937]/70 hover:bg-[#E8F3ED] hover:text-[#1F2937] border border-[#1F2937]/10"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Fluid Image Grid */}
      <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((item, idx) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45, ease: EASE }}
              onClick={() => setSelectedIdx(idx)}
              className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-md border border-[#1F2937]/10 bg-white sm:aspect-[4/5]"
            >
              <Pic
                src={item.img}
                alt={item.title}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="absolute inset-0"
                imgClassName="transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c2a1d]/85 via-[#0c2a1d]/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-90" />

              {/* Top metadata pill */}
              <div className="absolute left-3 top-3 flex items-center gap-2">
                <span className="rounded-sm bg-white/95 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#14402e] shadow-xs backdrop-blur-md">
                  {item.cat}
                </span>
                <span className="rounded-sm bg-black/40 px-2 py-0.5 text-[10px] font-mono text-white/90 backdrop-blur-md">
                  {item.area}
                </span>
              </div>

              {/* Bottom project caption */}
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <h4 className="text-base font-semibold leading-tight drop-shadow-xs transition-transform duration-300 group-hover:-translate-y-0.5">
                  {item.title}
                </h4>
                <p className="mt-1 text-xs text-white/75">{item.place}</p>
              </div>

              {/* Expand Indicator */}
              <div className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-sm bg-white/20 text-white opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
                <Icon n="plus" className="h-3.5 w-3.5" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Stats Band inspired by Interior's StatsStrip */}
      <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-[#1F2937]/10 bg-[#1F2937]/10 lg:grid-cols-4">
        {STATS.map((s, idx) => (
          <div key={s.label} className="flex flex-col justify-between bg-white p-5 text-left md:p-6">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#2F7D5B]">0{idx + 1}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#2F7D5B]/30" />
            </div>
            <dd className="mt-4 text-2xl font-bold tracking-tight text-[#1F2937] md:text-3xl">
              {s.val}
            </dd>
            <dt className="mt-1 text-[11px] font-medium uppercase tracking-wider text-[#1F2937]/60">
              {s.label}
            </dt>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIdx(null)}
            className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-md border border-white/20 bg-[#0c2a1d] shadow-2xl"
            >
              {/* Image Preview */}
              <div className="relative aspect-[16/10] w-full bg-black">
                <Pic
                  src={selectedItem.img}
                  alt={selectedItem.title}
                  sizes="100vw"
                  className="absolute inset-0"
                />
              </div>

              {/* Info Bar */}
              <div className="flex flex-col justify-between gap-4 border-t border-white/10 bg-[#14402e] p-5 text-white sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-sm bg-[#2F7D5B] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                      {selectedItem.cat}
                    </span>
                    <span className="text-xs text-white/60">{selectedItem.area}</span>
                  </div>
                  <h3 className="mt-1 text-lg font-bold sm:text-xl">{selectedItem.title}</h3>
                  <p className="text-xs text-white/70">{selectedItem.place}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={prevImage}
                    aria-label="Previous image"
                    className="grid h-9 w-9 place-items-center rounded-sm border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
                  >
                    <span className="rotate-180 inline-block"><Icon n="arrow" className="h-4 w-4" /></span>
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    aria-label="Next image"
                    className="grid h-9 w-9 place-items-center rounded-sm border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
                  >
                    <Icon n="arrow" className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedIdx(null)}
                    aria-label="Close modal"
                    className="ml-2 rounded-sm bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#14402e] transition hover:bg-[#CFEBD9]"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
