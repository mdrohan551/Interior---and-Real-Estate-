"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import Pic from "./Pic";
import { fmt } from "./JournalPreview";
import { EASE } from "./motion";
import { BASE, type Post } from "@/lib/real-estate/data";

/** Journal index: category chips + search + animated grid. */
export default function BlogExplorer({ posts }: { posts: Post[] }) {
  const cats = ["All", ...Array.from(new Set(posts.map((p) => p.cat)))];
  const [cat, setCat] = useState("All"); const [q, setQ] = useState("");
  const list = useMemo(() => posts.filter((p) => (cat === "All" || p.cat === cat) && (p.title + p.excerpt).toLowerCase().includes(q.toLowerCase())), [posts, cat, q]);
  return (
    <section className="w-full px-5 pb-20 md:px-8 lg:px-12 xl:px-16">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-sm border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                cat === c
                  ? "border-[#2F7D5B] bg-[#2F7D5B] text-white shadow-xs"
                  : "border-[#1F2937]/10 bg-white text-[#1F2937]/70 hover:bg-[#E8F3ED] hover:text-[#1F2937]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search articles..."
          className="w-full rounded-sm border border-[#1F2937]/15 bg-white px-4 py-2.5 text-xs text-[#1F2937] outline-none transition focus:border-[#2F7D5B] md:w-72"
        />
      </div>
      {list.length === 0 && <p className="py-16 text-center text-xs text-[#1F2937]/50">No articles match your search.</p>}
      <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p, i) => (
          <motion.article key={p.slug} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, ease: EASE, delay: (i % 3) * 0.08 }}>
            <Link href={`${BASE}/blog/${p.slug}`} data-cursor="Read" className="group block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-[#1F2937]/10 bg-white">
                <Pic src={p.img} alt={p.title} className="absolute inset-0" imgClassName="transition-transform duration-[900ms] ease-out group-hover:scale-105" />
              </div>
              <p className="mt-4 text-xs font-medium text-[#1F2937]/50">{fmt(p.date)} · {p.cat} · {p.read}</p>
              <h2 className="mt-1.5 text-lg font-semibold leading-snug md:text-xl">{p.title}</h2>
              <p className="mt-1.5 text-xs leading-relaxed text-[#1F2937]/60">{p.excerpt}</p>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
