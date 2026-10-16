"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Photo, { type Tone } from "@/components/ui/Photo";

export type SidebarPost = {
  id: string | number;
  slug: string;
  title: string;
  excerpt: string;
  date: string; // already formatted
  image?: string;
  tone: Tone;
};

const CATEGORIES = [
  "Interior Design",
  "Living Room",
  "Lighting & Acoustics",
  "Material Selection",
  "Small Spaces",
  "Sustainable Luxury",
];

/**
 * Blog details sidebar:
 * - Positioned on the right side of the main blog image & content
 * - Sticky effect on scroll (md:sticky md:top-28)
 * - Independently scrollable container (md:max-h-[calc(100vh-8.5rem)] md:overflow-y-auto)
 * - Isolated scroll: mouse over sidebar scrolls only the sidebar, mouse over content scrolls main page
 * - Live search with instant filtering
 * - Recent articles list with luxury photo thumbs
 */
export default function BlogSidebar({
  posts,
  recentCount,
}: {
  posts: SidebarPost[];
  recentCount?: number;
}) {
  const [query, setQuery] = useState("");
  const asideRef = useRef<HTMLElement>(null);

  // Default to showing all available posts so sidebar has rich scrollable content
  const limit = recentCount ?? (posts.length || 5);
  const q = query.trim().toLowerCase();
  const list = q
    ? posts.filter((x) => `${x.title} ${x.excerpt}`.toLowerCase().includes(q))
    : posts.slice(0, limit);

  // Stop wheel event from propagating to window/Lenis when hovering over the sidebar
  useEffect(() => {
    const el = asideRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      // Isolate wheel scrolling strictly to the sidebar container
      e.stopPropagation();
    };

    el.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      el.removeEventListener("wheel", onWheel);
    };
  }, []);

  return (
    <aside
      ref={asideRef}
      aria-label="Blog sidebar"
      data-lenis-prevent="true"
      data-lenis-prevent-wheel="true"
      data-lenis-prevent-touch="true"
      style={{ overscrollBehavior: "contain", WebkitOverflowScrolling: "touch" }}
      className="border-t border-lv-line pt-8 md:col-span-4 md:sticky md:top-28 md:max-h-[calc(100vh-8.5rem)] md:overflow-y-auto md:border-l md:border-t-0 md:pl-8 md:pt-0 overscroll-contain [scrollbar-width:thin] [scrollbar-color:rgba(0,0,0,0.18)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/15 hover:[&::-webkit-scrollbar-thumb]:bg-black/30 pr-1 md:pr-2.5"
    >
      {/* 1. Search Form */}
      <form
        role="search"
        onSubmit={(e) => e.preventDefault()}
        className="relative flex items-center gap-2"
      >
        <label htmlFor="blog-search" className="sr-only">
          Search articles
        </label>
        <div className="relative min-w-0 flex-1">
          <input
            id="blog-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            className="h-10 w-full rounded-md border border-lv-line bg-white/80 pl-9 pr-8 text-sm text-lv-ink outline-none transition-colors placeholder:text-lv-mute focus:border-lv-ink focus:bg-white"
          />
          <svg
            viewBox="0 0 20 20"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-lv-mute"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="9" r="6" />
            <path d="M14 14l4 4" />
          </svg>
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-lv-mute hover:text-lv-ink"
            >
              ✕
            </button>
          )}
        </div>
      </form>

      {/* 2. Heading for results / recent posts */}
      <div className="mt-7 flex items-center justify-between border-b border-lv-line/70 pb-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-lv-ink">
          {q ? `Results (${list.length})` : "Recent Articles"}
        </h2>
        <span className="text-[11px] text-lv-mute">
          {q ? "Filtered" : "Latest updates"}
        </span>
      </div>

      {/* 3. Articles List */}
      {list.length ? (
        <ul className="mt-5 space-y-6">
          {list.map((m) => (
            <li key={m.id} className="group">
              <Link href={`/interior/blog/${m.slug}`} className="flex gap-3.5 items-start">
                <div className="relative h-18 w-24 shrink-0 overflow-hidden rounded-sm bg-lv-panel">
                  <Photo
                    src={m.image}
                    tone={m.tone}
                    alt={m.title}
                    className="absolute inset-0 transition-transform duration-[1000ms] ease-lv group-hover:scale-108"
                    sizes="100px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 text-sm font-medium leading-snug text-lv-ink transition-colors group-hover:text-lv-deep">
                    {m.title}
                  </h3>
                  <p className="mt-1 text-[11px] text-lv-mute">{m.date}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 rounded-md border border-dashed border-lv-line p-5 text-center text-sm text-lv-mute">
          <p>No articles found for “{query}”.</p>
          <button
            onClick={() => setQuery("")}
            className="mt-2 text-xs font-medium text-lv-ink underline hover:text-lv-deep"
          >
            Clear search
          </button>
        </div>
      )}

      {/* 4. Popular Topics / Categories */}
      <div className="mt-9 border-t border-lv-line/80 pt-6">
        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-lv-ink">
          Popular Topics
        </h3>
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setQuery(cat)}
              className="rounded-full border border-lv-line bg-white/70 px-3 py-1 text-[11px] font-medium text-lv-mute transition-colors hover:border-lv-ink hover:text-lv-ink"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Quick Consultation CTA Box in Sidebar */}
      <div className="mt-8 rounded-md border border-lv-line/80 bg-lv-panel/70 p-5">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#9c8660]">
          Studio Consultation
        </span>
        <h4 className="mt-1.5 text-sm font-medium leading-snug text-lv-ink">
          Planning your interior renovation?
        </h4>
        <p className="mt-2 text-xs leading-relaxed text-lv-mute">
          Schedule an in-person site visit or concept discussion with our principal designers.
        </p>
        <Link
          href="/interior#consultation"
          className="mt-3.5 inline-flex items-center gap-1.5 text-xs font-semibold text-lv-ink hover:underline"
        >
          Book a Consultation &rarr;
        </Link>
      </div>
    </aside>
  );
}

export { BlogSidebar };