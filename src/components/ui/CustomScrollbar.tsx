"use client";

import React, { useRef, useState, useCallback, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import Lenis from "lenis";

const BASE_MIN_THUMB_PX = 150;
const PER_LINK_PX = 42;
const CARD_W = 340;
const CARD_VIEW_W = CARD_W - 20; // card padding 10px each side
const CARD_VIEW_H = 200;
const FRAME_W = 1280; // virtual desktop viewport inside iframe
const CARD_H = CARD_VIEW_H + 112; // viewport + header + footer

interface SiteLink {
  id: string;
  label: string;
  shortLabel: string;
  href: string;
  tag: string;
  accent: string;
}

const SITE_LINKS: SiteLink[] = [
  { id: "interior", label: "Interior", shortLabel: "IN", href: "/interior", tag: "The Interior Studio", accent: "#c9a84c" },
  { id: "real-estate", label: "Real Estate", shortLabel: "RE", href: "/real-estate", tag: "The Real Estate Studio", accent: "#2F7D5B" },
];

/** Build preview url: same page, but with ?embed=1 so the scrollbar hides itself inside the iframe */
const toEmbedUrl = (href: string) => {
  const [path, hash = ""] = href.split("#");
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}embed=1${hash ? `#${hash}` : ""}`;
};

/** Only allow internal paths coming from the URL (no external sites, no protocol-relative) */
const isSafePath = (p: string) => p.startsWith("/") && !p.startsWith("//") && !p.includes("\\");

const prettyLabel = (path: string) => {
  const seg = path.split("?")[0].split("/").filter(Boolean).pop() || "Home";
  const clean = decodeURIComponent(seg).replace(/[-_]+/g, " ");
  return clean.charAt(0).toUpperCase() + clean.slice(1);
};

const parseExtraLinks = (): SiteLink[] => {
  if (typeof window === "undefined") return [];
  const params = new URLSearchParams(window.location.search);
  const raw = params.getAll("preview").flatMap((v) => v.split(","));
  const seen = new Set(SITE_LINKS.map((l) => l.href));
  const list: SiteLink[] = [];
  raw.forEach((v, i) => {
    const p = v.trim();
    if (!p || !isSafePath(p) || seen.has(p)) return;
    seen.add(p);
    const label = prettyLabel(p);
    list.push({
      id: `custom-${i}-${p}`,
      label,
      shortLabel: label.slice(0, 2).toUpperCase(),
      href: p,
      tag: p,
      accent: "#c9a84c",
    });
  });
  return list;
};

const scrollToY = (y: number, immediate = false) => {
  const win = window as unknown as { __lenis?: Lenis };
  if (win.__lenis) win.__lenis.scrollTo(y, immediate ? { immediate: true } : undefined);
  else window.scrollTo({ top: y, behavior: immediate ? "instant" : "smooth" });
};

/* ----------------------------- Live iframe preview ----------------------------- */

function PreviewFrame({
  src,
  width = CARD_VIEW_W,
  height = CARD_VIEW_H,
}: {
  src: string;
  width?: number;
  height?: number;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);
  const scale = width / FRAME_W;
  const frameH = Math.round(height / scale);

  // Gentle auto-scroll (ping-pong) inside the preview, works for same-origin pages
  useEffect(() => {
    if (!loaded) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      try {
        const win = iframeRef.current?.contentWindow;
        const doc = win?.document.documentElement;
        if (win && doc) {
          const max = Math.min(Math.max(0, doc.scrollHeight - win.innerHeight), 2600);
          const t = ((now - start) / 1000) % 16; // 16s loop
          const p = t < 8 ? t / 8 : 1 - (t - 8) / 8; // 0 -> 1 -> 0
          const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
          win.scrollTo({ top: max * eased, behavior: "instant" as ScrollBehavior });
        }
      } catch {
        /* cross-origin: just show the page */
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [loaded]);

  return (
    <div
      className="relative overflow-hidden rounded-md bg-white ring-1 ring-white/10"
      style={{ width, height }}
    >
      {!loaded && (
        <div className="absolute inset-0 z-10 flex animate-pulse flex-col gap-2 bg-[#2a2926] p-3">
          <div className="h-2 w-1/3 rounded bg-white/10" />
          <div className="h-16 w-full rounded-lg bg-white/10" />
          <div className="grid grid-cols-2 gap-2">
            <div className="h-14 rounded-lg bg-white/10" />
            <div className="h-14 rounded-lg bg-white/10" />
          </div>
          <div className="h-2 w-1/2 rounded bg-white/10" />
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={src}
        title="Live page preview"
        tabIndex={-1}
        loading="eager"
        onLoad={() => setLoaded(true)}
        className={`absolute left-0 top-0 origin-top-left border-0 bg-white transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"
          }`}
        style={{
          width: FRAME_W,
          height: frameH,
          transform: `scale(${scale})`,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

/* ------------------------------ Mobile bottom notch ------------------------------ */

function MobileIsland({
  links,
  progress,
  isActive,
}: {
  links: SiteLink[];
  progress: number;
  isActive: (href: string) => boolean;
}) {
  const pathname = usePathname();
  const [sheet, setSheet] = useState(false);
  const [preview, setPreview] = useState<SiteLink | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [vw, setVw] = useState(375);

  // The Interior & Real Estate headers listen for events (menu lives in their headers)
  const isInterior = pathname.startsWith("/interior");
  const isRealEstate = pathname.startsWith("/real-estate");

  useEffect(() => {
    const onResize = () => {
      const width = Math.min(
        window.innerWidth || 375,
        document.documentElement.clientWidth || window.innerWidth || 375
      );
      setVw(width);
    };
    onResize();
    window.addEventListener("resize", onResize, { passive: true });
    window.visualViewport?.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
    };
  }, []);

  // Header tells us when its menu opens/closes so the icon can morph to X
  useEffect(() => {
    const onState = (e: Event) => {
      const open = Boolean((e as CustomEvent<boolean>).detail);
      setMenuOpen(open);
      if (open) {
        setSheet(false);
        setPreview(null);
      }
    };
    window.addEventListener("interior:menu-state", onState);
    window.addEventListener("real-estate:menu-state", onState);
    return () => {
      window.removeEventListener("interior:menu-state", onState);
      window.removeEventListener("real-estate:menu-state", onState);
    };
  }, []);

  // close after navigating
  const [prevNavPath, setPrevNavPath] = useState(pathname);
  if (prevNavPath !== pathname) {
    setPrevNavPath(pathname);
    setSheet(false);
    setPreview(null);
  }

  // 34px ear on each side, so the body is always narrower than the screen by 68px
  const collapsedW = Math.min(330, Math.max(220, vw - 76));
  const expandedW = Math.min(380, Math.max(240, vw - 76));
  const R = 17;
  const C = 2 * Math.PI * R;
  const shown = preview ?? links.find((l) => isActive(l.href)) ?? links[0];

  const onCenter = () => {
    if (isInterior) {
      window.dispatchEvent(new Event("interior:menu-toggle"));
    } else if (isRealEstate) {
      window.dispatchEvent(new Event("real-estate:menu-toggle"));
    } else {
      setSheet((v) => !v);
    }
  };

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[99999] flex justify-center sm:hidden"
      aria-label="Page navigation"
    >
      {/* tap outside to close */}
      <AnimatePresence>
        {sheet && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSheet(false)}
            className="pointer-events-auto fixed inset-0 -z-10 bg-black/25 backdrop-blur-[2px]"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 340, damping: 30, mass: 0.7 }}
        className="relative drop-shadow-[0_-10px_30px_rgba(28,27,24,0.28)]"
      >
        {/* Left ear (concave curve, 1.5px overlap so no seam shows) */}
        <svg
          className="pointer-events-none absolute bottom-0 right-[calc(100%-1.5px)] h-8 w-[34px] text-[#1c1b18]"
          viewBox="0 0 34 32"
          fill="none"
          shapeRendering="geometricPrecision"
          aria-hidden="true"
        >
          <path d="M34 32H0C17.673 32 32 17.673 32 0H34V32Z" fill="currentColor" />
        </svg>

        {/* Right ear */}
        <svg
          className="pointer-events-none absolute bottom-0 left-[calc(100%-1.5px)] h-8 w-[34px] text-[#1c1b18]"
          viewBox="0 0 34 32"
          fill="none"
          shapeRendering="geometricPrecision"
          aria-hidden="true"
        >
          <path d="M0 32H34C16.327 32 2 17.673 2 0H0V32Z" fill="currentColor" />
        </svg>

        {/* Notch body: the sites panel grows inside it, it is the same shape */}
        <motion.div
          initial={false}
          animate={{ width: sheet ? expandedW : collapsedW }}
          transition={{ type: "spring", stiffness: 340, damping: 32, mass: 0.7 }}
          className="pointer-events-auto relative overflow-hidden rounded-t-[28px] bg-[#1c1b18] text-[#f3f1ed]"
          style={{
            width: sheet ? expandedW : collapsedW,
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          {/* EXPANDED: sites chips + live preview */}
          <AnimatePresence initial={false}>
            {sheet && shown && (
              <motion.div
                key="panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 340, damping: 34, mass: 0.7 }}
                className="overflow-hidden"
              >
                <div className="mx-auto p-2.5 pt-4" style={{ width: expandedW }}>
                  {/* chips */}
                  <div className="mb-2.5 flex gap-1.5 justify-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {links.map((item) => {
                      const on = shown.id === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setPreview(item)}
                          className={`flex shrink-0 items-center gap-1.5 rounded px-3 py-1.5 text-[11px] transition-colors ${on ? "text-[#1c1b18]" : "bg-white/10 text-[#f3f1ed]/80 active:bg-white/20"
                            }`}
                          style={on ? { backgroundColor: item.accent } : undefined}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Real page preview */}
                  <PreviewFrame key={shown.id} src={toEmbedUrl(shown.href)} width={expandedW - 20} height={150} />

                  {/* Footer */}
                  <div className="mt-2.5 flex items-center justify-between px-0.5">
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium">{shown.label}</p>
                      <p className="mt-0.5 truncate text-[10px] text-white/55">{shown.tag}</p>
                    </div>
                    <Link
                      href={shown.href}
                      className="rounded bg-[#f3f1ed] px-3.5 py-1.5 text-[11px] font-semibold text-[#1c1b18] active:bg-[#c9a84c]"
                    >
                      Open Page
                    </Link>
                  </div>
                </div>

                <div className="mx-4 mt-1 h-px bg-white/10" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* CONTROLS: sites | menu | talk | top (with progress ring) */}
          <div className="flex h-[58px] items-center justify-between px-2.5">
            {/* Sites button (tap = sites + live preview) */}
            <button
              type="button"
              onClick={() => setSheet((v) => !v)}
              aria-label={sheet ? "Close sites preview" : "Show sites preview"}
              aria-expanded={sheet}
              className="flex h-9 items-center justify-center w-9 ring-2 ring-[#8181816e] rounded-full outline-none transition-colors"
            >
              {sheet ? (
                <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3.5 6l4.5 4.5L12.5 6" />
                </svg>
              ) : (
                <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor" aria-hidden="true">
                  <rect x="1.5" y="1.5" width="5" height="5" rx="1.4" />
                  <rect x="9.5" y="1.5" width="5" height="5" rx="1.4" />
                  <rect x="1.5" y="9.5" width="5" height="5" rx="1.4" />
                  <rect x="9.5" y="9.5" width="5" height="5" rx="1.4" />
                </svg>
              )}
            </button>

            {/* Menu icon */}
            <button
              type="button"
              onClick={onCenter}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="relative grid size-12 place-items-center rounded-full bg-[#f3f1ed] text-[#1c1b18] shadow-md outline-none transition-transform focus:outline-none active:scale-95"
            >
              <span
                className={`absolute h-px w-5 bg-current transition-transform duration-300 ${menuOpen ? "rotate-45" : "-translate-y-[3px]"
                  }`}
              />
              <span
                className={`absolute h-px w-5 bg-current transition-transform duration-300 ${menuOpen ? "-rotate-45" : "translate-y-[3px]"
                  }`}
              />
            </button>

            {/* Back to top, scroll progress ring around the arrow */}
            <button
              type="button"
              onClick={() => {
                scrollToY(0);
                setSheet(false);
              }}
              aria-label={`Back to top (${progress}% scrolled)`}
              className="relative grid size-11 place-items-center rounded-full outline-none transition-colors focus:outline-none active:bg-white/10"
            >
              <svg viewBox="0 0 40 40" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
                <circle cx="20" cy="20" r={R} fill="none" stroke="rgba(243,241,237,0.15)" strokeWidth="2.5" />
                <circle
                  cx="20"
                  cy="20"
                  r={R}
                  fill="none"
                  stroke="#c9a84c"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={C}
                  strokeDashoffset={C * (1 - progress / 100)}
                  style={{ transition: "stroke-dashoffset 0.2s linear" }}
                />
              </svg>
              <svg viewBox="0 0 16 16" className="relative size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M8 13V3M3.5 7.5L8 3l4.5 4.5" />
              </svg>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* --------------------------------- Main component -------------------------------- */

export default function CustomScrollbar() {
  const pathname = usePathname();
  const embedded = useSyncExternalStore(
    () => () => {},
    () => window.self !== window.top || new URLSearchParams(window.location.search).get("embed") === "1",
    () => false
  );
  const [extraLinks, setExtraLinks] = useState<SiteLink[]>(parseExtraLinks);
  const [prevNav, setPrevNav] = useState(pathname);
  if (prevNav !== pathname) {
    setPrevNav(pathname);
    setExtraLinks(parseExtraLinks());
  }

  const [thumb, setThumb] = useState({ top: 0, height: 0, visible: false, progress: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<SiteLink | null>(null);
  const [vh, setVh] = useState(800);

  const startY = useRef(0);
  const startScrollTop = useRef(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateThumb = useCallback(() => {
    if (typeof window === "undefined") return;

    const doc = document.documentElement;
    const body = document.body;
    const scrollTop = window.scrollY || doc.scrollTop || body.scrollTop || 0;
    const scrollHeight = Math.max(doc.scrollHeight, body.scrollHeight, doc.offsetHeight, body.offsetHeight);
    const clientHeight = window.visualViewport?.height || window.innerHeight || doc.clientHeight || 0;
    setVh(clientHeight);

    if (scrollHeight <= clientHeight + 30) {
      setThumb((t) => (t.visible ? { top: 0, height: 0, visible: false, progress: 0 } : t));
      return;
    }

    // island grows with the number of links so nothing gets cut
    const minThumb = BASE_MIN_THUMB_PX + (SITE_LINKS.length + extraLinks.length) * PER_LINK_PX;
    const trackHeight = clientHeight;
    const calculated = (clientHeight / scrollHeight) * trackHeight;
    const thumbHeight = Math.max(minThumb, Math.min(trackHeight * 0.55, calculated));
    const maxTop = trackHeight - thumbHeight;
    const maxScroll = scrollHeight - clientHeight;
    const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0;

    setThumb({
      top: Math.max(0, Math.min(maxTop, ratio * maxTop)),
      height: thumbHeight,
      visible: true,
      progress: Math.round(ratio * 100),
    });
  }, [extraLinks.length]);

  const links = [...SITE_LINKS, ...extraLinks];

  const handleLinkEnter = (item: SiteLink) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setHoveredLink(item);
  };

  const handleLinkLeave = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setHoveredLink(null), 180);
  };

  useEffect(() => {
    if (embedded) return;
    const rafId = requestAnimationFrame(() => updateThumb());

    const handleScroll = () => updateThumb();
    window.addEventListener("scroll", handleScroll, { passive: true, capture: true });
    window.addEventListener("resize", updateThumb, { passive: true });
    window.visualViewport?.addEventListener("resize", updateThumb, { passive: true });
    window.visualViewport?.addEventListener("scroll", handleScroll, { passive: true });

    let resizeObserver: ResizeObserver | null = null;
    let mutationObserver: MutationObserver | null = null;

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => updateThumb());
      if (document.body) resizeObserver.observe(document.body);
      if (document.documentElement) resizeObserver.observe(document.documentElement);
    }

    if (typeof MutationObserver !== "undefined" && document.body) {
      mutationObserver = new MutationObserver(() => updateThumb());
      mutationObserver.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", updateThumb);
      window.visualViewport?.removeEventListener("resize", updateThumb);
      window.visualViewport?.removeEventListener("scroll", handleScroll);
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
    };
  }, [updateThumb, embedded]);

  // Dragging
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setHoveredLink(null);
    setIsDragging(true);
    startY.current = e.clientY;
    startScrollTop.current = window.scrollY || document.documentElement.scrollTop;
    document.body.style.userSelect = "none";
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - window.innerHeight;
      const maxTop = window.innerHeight - thumb.height;
      if (maxTop <= 0 || maxScroll <= 0) return;

      const deltaY = e.clientY - startY.current;
      const scrollRatio = maxScroll / maxTop;
      const target = Math.max(0, Math.min(maxScroll, startScrollTop.current + deltaY * scrollRatio));
      scrollToY(target, true);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      document.body.style.userSelect = "";
    };

    if (isDragging) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    }
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging, thumb.height]);

  // Click track to jump
  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== trackRef.current) return;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    scrollToY((e.clientY / window.innerHeight) * maxScroll);
  };

  const isRouteActive = (href: string) => {
    const base = href.split("?")[0];
    return base === "/" ? pathname === "/" : pathname.startsWith(base);
  };

  // Hidden inside previews, and on the entry screen (/) which has no scrolling
  if (embedded || pathname === "/") return null;

  // Keep the preview card fully inside the viewport, centered on the thumb
  const cardTop = Math.max(12, Math.min(vh - CARD_H - 12, thumb.top + thumb.height / 2 - CARD_H / 2));
  const expanded = isHovered || !!hoveredLink;

  return (
    <>
      {thumb.visible && (
        /* ============================ DESKTOP: Apple island notch ============================ */
        <div
          className="pointer-events-none fixed inset-y-0 right-0 z-[99999] hidden select-none sm:block"
          aria-label="Page navigation scrollbar"
        >
          {/* Click-to-scroll track */}
          <div
            ref={trackRef}
            onClick={handleTrackClick}
            className="group/track pointer-events-auto absolute inset-y-0 right-0 w-3 cursor-pointer"
            title="Click to scroll"
          >
            <div className="absolute inset-y-0 right-0 w-[1.5px] bg-[#1c1b18]/10 transition-colors group-hover/track:bg-[#1c1b18]/30" />
          </div>

          {/* LIVE PREVIEW CARD (clamped to viewport) */}
          <AnimatePresence mode="wait">
            {hoveredLink && !isDragging && (
              <motion.div
                key={hoveredLink.id}
                initial={{ opacity: 0, x: 16, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 12, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                onMouseEnter={() => {
                  if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
                }}
                onMouseLeave={handleLinkLeave}
                onPointerDown={(e) => e.stopPropagation()}
                className="pointer-events-auto absolute right-[62px] rounded-2xl border border-white/10 bg-[#1c1b18]/90 p-2.5 text-white shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
                style={{ top: cardTop, width: CARD_W }}
              >
                <Link href={hoveredLink.href} className="group/card block" onClick={(e) => e.stopPropagation()}>
                  {/* Real page in iframe */}
                  <PreviewFrame key={hoveredLink.id} src={toEmbedUrl(hoveredLink.href)} />

                  {/* Footer */}
                  <div className="mt-2.5 flex items-center justify-between px-0.5">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full" style={{ backgroundColor: hoveredLink.accent }} />
                        <p className="truncate text-[13px] font-medium">{hoveredLink.label}</p>
                      </div>
                      <p className="mt-0.5 truncate text-[10px] text-white/55">{hoveredLink.tag}</p>
                    </div>
                    <span className="rounded bg-[#f3f1ed] px-3 py-1.5 text-[10px] font-semibold text-[#1c1b18] transition-colors group-hover/card:bg-[#c9a84c]">
                      Open Page
                    </span>
                  </div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ISLAND NOTCH THUMB (attached to the right edge) */}
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, y: thumb.top, height: thumb.height, opacity: 1 }}
            transition={
              isDragging
                ? { duration: 0 }
                : { type: "spring", stiffness: 290, damping: 28, mass: 0.6 }
            }
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
              setIsHovered(false);
              handleLinkLeave();
            }}
            className="pointer-events-auto absolute right-0 top-0 flex items-center drop-shadow-[-8px_10px_24px_rgba(28,27,24,0.22)]"
            style={{ top: 0 }}
          >
            <motion.div
              onPointerDown={handlePointerDown}
              animate={{ width: expanded ? 50 : 36 }}
              transition={{ type: "spring", stiffness: 340, damping: 28 }}
              className={`flex h-full flex-col items-center justify-start ${isDragging ? "cursor-grabbing" : "cursor-grab"
                }`}
              title="Drag to scroll, hover a link to preview"
            >
              {/* Top S-curve */}
              <svg
                viewBox="0 0 46 36"
                preserveAspectRatio="none"
                shapeRendering="geometricPrecision"
                className="-mb-[1.5px] h-[28px] w-full shrink-0 fill-[#1c1b18]"
                aria-hidden="true"
              >
                <path d="M 46 0 C 46 18, 0 18, 0 36 L 46 36 Z" />
              </svg>

              {/* Body */}
              <div className="relative flex w-full flex-1 flex-col items-center justify-between border-l border-white/10 bg-[#1c1b18] px-1 py-2 text-[#f3f1ed]">
                {/* Progress */}
                <div className="flex flex-col items-center gap-0.5">
                  <span className="font-mono text-[10px] font-semibold tabular-nums leading-none">
                    {String(thumb.progress).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[7px] uppercase tracking-widest text-white/40">%</span>
                </div>

                {/* Links */}
                <div
                  className="z-10 my-1.5 flex w-full flex-col items-center gap-1.5 px-0.5"
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  {links.map((item) => {
                    const active = isRouteActive(item.href);
                    const hot = hoveredLink?.id === item.id;
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={(e) => e.stopPropagation()}
                        onMouseEnter={() => handleLinkEnter(item)}
                        onFocus={() => handleLinkEnter(item)}
                        aria-current={active ? "page" : undefined}
                        className={`relative flex w-full flex-col items-center justify-center rounded py-1.5 outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#c9a84c] ${active
                            ? "bg-[#f3f1ed] text-[#1c1b18] shadow-xs"
                            : hot
                              ? "text-[#1c1b18]"
                              : "bg-white/[0.08] text-[#f3f1ed]/80 hover:bg-white/15 hover:text-white"
                          }`}
                        style={hot && !active ? { backgroundColor: item.accent } : undefined}
                      >
                        <span
                          className="mb-0.5 size-1.5 rounded-full"
                          style={{ backgroundColor: active || hot ? "#1c1b18" : item.accent }}
                        />
                        <span className="max-w-full truncate text-[8.5px] font-semibold leading-none tracking-tight">
                          {expanded ? item.label : item.shortLabel}
                        </span>
                      </Link>
                    );
                  })}
                </div>

                {/* Vertical label + grip */}
                <div className="flex flex-col items-center gap-1.5">
                  <span
                    className="pointer-events-none select-none whitespace-nowrap font-mono text-[8px] tracking-[0.25em] text-white/45"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                  >
                    DRAG
                  </span>
                  <div className="flex flex-col items-center gap-1 opacity-45">
                    <span className="h-1 w-1 rounded-full bg-[#f3f1ed]" />
                    <span className="h-1 w-1 rounded-full bg-[#f3f1ed]" />
                  </div>
                </div>
              </div>

              {/* Bottom S-curve */}
              <svg
                viewBox="0 0 46 36"
                preserveAspectRatio="none"
                shapeRendering="geometricPrecision"
                className="-mt-[1.5px] h-[28px] w-full shrink-0 fill-[#1c1b18]"
                aria-hidden="true"
              >
                <path d="M 0 0 C 0 18, 46 18, 46 36 L 46 0 Z" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      )}

      {/* ============================ PHONE: bottom notch ============================ */}
      <MobileIsland links={links} progress={thumb.progress} isActive={isRouteActive} />
    </>
  );
}