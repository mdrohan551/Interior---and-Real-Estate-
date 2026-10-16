"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import ProjectCard from "./ProjectCard";
import { EASE } from "./motion";
import { getProjects } from "@/lib/real-estate/api";
import { CATS, type CatFilter, type Project } from "@/lib/real-estate/data";

const LIMIT = 9;
const RATIOS = ["aspect-[4/5]", "aspect-[4/3]", "aspect-square", "aspect-[3/4]"];

/** Category filter + masonry + infinite scroll (IntersectionObserver). Works for hundreds of projects: only one page loads at a time. */
export default function PortfolioExplorer({ initialCat = "All", counts }: { initialCat?: CatFilter; counts: Record<string, number> }) {
  const [cat, setCat] = useState<CatFilter>(initialCat);
  const [prevCat, setPrevCat] = useState(cat);
  const [items, setItems] = useState<Project[]>([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const sentinel = useRef<HTMLDivElement>(null);

  if (prevCat !== cat) {
    setPrevCat(cat);
    setLoading(true);
  }

  useEffect(() => {
    let off = false;
    getProjects({ cat, page: 1, limit: LIMIT }).then((r) => { if (off) return; setItems(r.items); setPage(1); setMore(r.hasMore); setLoading(false); });
    return () => { off = true; };
  }, [cat]);

  const loadMore = async () => {
    if (loading || !more) return;
    setLoading(true);
    const r = await getProjects({ cat, page: page + 1, limit: LIMIT });
    setItems((p) => [...p, ...r.items]); setPage((n) => n + 1); setMore(r.hasMore); setLoading(false);
  };
  const fn = useRef(loadMore);
  useEffect(() => {
    fn.current = loadMore;
  });
  useEffect(() => {
    const el = sentinel.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && fn.current(), { rootMargin: "500px" });
    io.observe(el); return () => io.disconnect();
  }, []);

  const pick = (c: CatFilter) => { setCat(c); window.history.replaceState(null, "", c === "All" ? window.location.pathname : `?cat=${c}`); };

  return (
    <section className="w-full px-5 pb-20 md:px-8 lg:px-12 xl:px-16">
      <div role="tablist" className="mb-8 flex flex-wrap gap-2">
        {CATS.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={cat === c}
            onClick={() => pick(c)}
            className={`relative rounded-sm border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
              cat === c
                ? "border-[#2F7D5B] bg-[#2F7D5B] text-white shadow-xs"
                : "border-[#1F2937]/10 bg-white text-[#1F2937]/70 hover:bg-[#E8F3ED] hover:text-[#1F2937]"
            }`}
          >
            {c} <sup className="font-mono text-[10px] opacity-75">{counts[c] ?? 0}</sup>
          </button>
        ))}
      </div>
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {items.map((p, i) => (
          <motion.div key={p.slug} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, ease: EASE, delay: (i % 3) * 0.08 }} className="mb-6 break-inside-avoid">
            <ProjectCard p={p} ratio={RATIOS[i % RATIOS.length]} />
          </motion.div>
        ))}
      </div>
      <div ref={sentinel} className="flex h-20 items-center justify-center">
        {loading ? <span className="text-xs text-[#1F2937]/50">Loading...</span> : more ? <button onClick={loadMore} className="rounded-sm border border-[#1F2937]/15 bg-white px-6 py-2.5 text-xs font-semibold uppercase tracking-wider transition hover:bg-[#CFEBD9]">Load more</button> : <span className="text-xs text-[#1F2937]/40">You&apos;ve seen all {items.length} projects</span>}
      </div>
    </section>
  );
}
