import Link from "next/link";
import Pic from "./Pic";
import { MaskText, ScrollReveal } from "./motion";
import { Icon } from "./icons";
import { BASE, type Post } from "@/lib/real-estate/data";

export const fmt = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

/** The Imagine Journal: one featured post + two compact rows. */
export default function JournalPreview({ posts }: { posts: Post[] }) {
  const [f, ...rest] = posts;
  return (
    <section className="w-full px-5 py-12 md:px-8 md:py-18 lg:px-12 xl:px-16">
      <div className="mb-10 flex items-end justify-between gap-6">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#2F7D5B]">Journal</p>
          <MaskText text="Guides for smarter design decisions." className="max-w-2xl text-3xl font-semibold leading-[1.08] tracking-tight md:text-5xl" />
          <p className="mt-2.5 max-w-xl text-base sm:text-lg md:text-xl text-[#1F2937]/75">
            Expert architectural perspectives on material choice, space planning, acoustics, and timeless interiors.
          </p>
        </div>
        <Link
          href={`${BASE}/blog`}
          className="hidden items-center gap-2 rounded-sm border border-[#1F2937]/15 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#1F2937] transition hover:bg-[#CFEBD9] md:flex"
        >
          View all <Icon n="arrow" className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <ScrollReveal>
          <Link href={`${BASE}/blog/${f.slug}`} data-cursor="Read" className="group block">
            <div className="relative aspect-[16/11] overflow-hidden rounded-md border border-[#1F2937]/10 bg-white">
              <Pic src={f.img} alt={f.title} className="absolute inset-0" imgClassName="transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]" />
            </div>
            <p className="mt-4 text-sm font-semibold text-[#1F2937]/60">{fmt(f.date)} · {f.cat}</p>
            <h3 className="mt-2 max-w-xl text-2xl font-semibold leading-tight md:text-3xl text-[#1F2937]">{f.title}</h3>
            <p className="mt-2.5 max-w-xl text-base sm:text-lg text-[#1F2937]/75 line-clamp-2">{f.excerpt}</p>
          </Link>
        </ScrollReveal>
        <div className="flex flex-col gap-4 md:gap-5">
          {rest.slice(0, 2).map((p, i) => (
            <ScrollReveal key={p.slug} delay={0.15 * (i + 1)}>
              <Link
                href={`${BASE}/blog/${p.slug}`}
                data-cursor="Read"
                className="group flex gap-4 rounded-md border border-[#1F2937]/10 bg-white p-3.5 shadow-xs transition hover:border-[#2F7D5B]/30 md:gap-5 md:p-4"
              >
                <div className="relative aspect-square w-28 shrink-0 overflow-hidden rounded-sm md:w-36">
                  <Pic src={p.img} alt={p.title} className="absolute inset-0" sizes="160px" imgClassName="transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-xs text-[#1F2937]/50">{fmt(p.date)}</p>
                  <h3 className="mt-1.5 text-base font-semibold leading-snug md:text-lg">{p.title}</h3>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
