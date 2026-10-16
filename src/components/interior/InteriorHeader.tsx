"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import gsap from "gsap";
import Magnetic from "@/components/motion/Magnetic";
import { interior } from "@/lib/interior";
import { useInteriorContact, useInteriorReady } from "./interiorStore";

const isActive = (path: string, href: string) =>
  href === "/interior" ? path === href : path.startsWith(href);

const FRAME_W = 1280; // virtual desktop viewport inside the thumbnail iframe
const THUMB_H = 92;

const showcaseCards = [
  {
    id: "01",
    tag: "Bold & Warm Luxury",
    title: "Interior",
    subtitle: "Contemporary elegant interior design",
    bg: "bg-[#1c1b18] text-white",
    accent: "bg-white/15 text-white",
    href: "/interior",
  },
  {
    id: "02",
    tag: "Nordic Minimalism",
    title: "Real Estate",
    subtitle: "Quiet light & pure form architecture",
    bg: "bg-[#f3f1ed] text-lv-ink",
    accent: "bg-lv-ink/10 text-lv-ink",
    href: "/real-estate",
  },
];

/** Same page with ?embed=1 so the custom scrollbar hides itself inside previews */
const toEmbedUrl = (href: string) => {
  const sep = href.includes("?") ? "&" : "?";
  return `${href}${sep}embed=1`;
};

/** Scaled-down live page inside a card */
function SiteThumb({ src, active }: { src: string; active: boolean }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    setW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const scale = w ? w / FRAME_W : 0;

  return (
    <div
      ref={boxRef}
      className="relative w-full overflow-hidden rounded-xl bg-black/10 ring-1 ring-black/10"
      style={{ height: THUMB_H }}
    >
      {!loaded && <div className="absolute inset-0 animate-pulse bg-black/10" />}
      {active && scale > 0 && (
        <iframe
          src={src}
          title="Live page preview"
          tabIndex={-1}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`absolute left-0 top-0 origin-top-left border-0 bg-white transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"
            }`}
          style={{
            width: FRAME_W,
            height: Math.round(THUMB_H / scale),
            transform: `scale(${scale})`,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}

export default function InteriorHeader() {
  const path = usePathname();
  const show = useInteriorContact((s) => s.show);
  const ready = useInteriorReady((s) => s.ready);

  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState(false);

  // Live previews only load once the menu was opened, and never inside another preview
  const embedded = useSyncExternalStore(
    () => () => {},
    () => window.self !== window.top || new URLSearchParams(window.location.search).get("embed") === "1",
    () => false
  );

  // Smooth GSAP morphing refs
  const hasOpenedRef = useRef(false);
  const [hasOpenedMenu, setHasOpenedMenu] = useState(false);
  if (menu && !hasOpenedMenu) {
    setHasOpenedMenu(true);
  }
  const clipWrapperRef = useRef<HTMLDivElement>(null);
  const compactBarRef = useRef<HTMLElement>(null);
  const expandedRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<(HTMLDivElement | null)[]>([]);
  const cardsSectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  // Cards slider (drag with mouse + arrow button)
  const sliderRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, startX: 0, startLeft: 0, moved: 0 });
  const [dragging, setDragging] = useState(false);
  const [atEnd, setAtEnd] = useState(false);

  const syncEnd = () => {
    const el = sliderRef.current;
    if (!el) return;
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  };

  // Mouse drag only. Touch phones already swipe natively.
  const onSliderDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !sliderRef.current) return;
    drag.current = {
      down: true,
      startX: e.clientX,
      startLeft: sliderRef.current.scrollLeft,
      moved: 0,
    };
    setDragging(true);
  };

  const onSliderMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.down || !sliderRef.current) return;
    const dx = e.clientX - d.startX;
    d.moved = Math.max(d.moved, Math.abs(dx));
    sliderRef.current.scrollLeft = d.startLeft - dx;
  };

  const endDrag = () => {
    if (!drag.current.down) return;
    drag.current.down = false;
    setDragging(false);
  };

  // If the pointer moved, it was a drag, not a click: don't open the card link.
  const onSliderClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (drag.current.moved > 5) {
      e.preventDefault();
      e.stopPropagation();
    }
    drag.current.moved = 0;
  };

  const slideCards = () => {
    const el = sliderRef.current;
    if (!el) return;
    if (atEnd) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      const step = (cardsRef.current[0]?.offsetWidth ?? 210) + 12;
      el.scrollBy({ left: step, behavior: "smooth" });
    }
  };

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 24);
      setHidden(y > last && y > 160);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Phone: the menu icon now lives in the bottom island and talks to the header by events
  useEffect(() => {
    const toggle = () => setMenu((v) => !v);
    window.addEventListener("interior:menu-toggle", toggle);
    return () => window.removeEventListener("interior:menu-toggle", toggle);
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("interior:menu-state", { detail: menu }));
  }, [menu]);

  const [prevPath, setPrevPath] = useState(path);
  if (prevPath !== path) {
    setPrevPath(path);
    setMenu(false);
  }

  useEffect(() => {
    document.documentElement.style.overflow = menu ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menu]);

  // Smooth Expand & Minimize GSAP Timeline (Desktop + Mobile)
  useEffect(() => {
    const wrapper = clipWrapperRef.current;
    const compact = compactBarRef.current;
    const expanded = expandedRef.current;
    if (!wrapper || !expanded) return;

    const isMobile = window.innerWidth < 768;
    const linkEls = linksRef.current.filter(Boolean);
    const cardEls = cardsRef.current.filter(Boolean);

    gsap.killTweensOf([
      wrapper,
      compact,
      expanded,
      cardsSectionRef.current,
      ...linkEls,
      ...cardEls,
    ]);

    if (menu) {
      hasOpenedRef.current = true;

      const targetW = expanded.offsetWidth;
      const targetH = expanded.offsetHeight;
      const startW = !isMobile && compact ? compact.offsetWidth : targetW;
      const startH = !isMobile && compact ? compact.offsetHeight : 0;

      const tl = gsap.timeline();

      gsap.set(wrapper, {
        width: startW,
        height: startH,
        opacity: isMobile ? 0 : 1,
        pointerEvents: "auto",
      });

      gsap.set(expanded, {
        opacity: 1,
        pointerEvents: "auto",
      });

      if (!isMobile && compact) {
        tl.to(
          compact,
          {
            opacity: 0,
            y: -8,
            duration: 0.22,
            ease: "power2.out",
            pointerEvents: "none",
          },
          0
        );
      }

      tl.to(
        wrapper,
        {
          width: targetW,
          height: targetH,
          opacity: 1,
          duration: 0.68,
          ease: "expo.inOut",
        },
        0
      );

      tl.fromTo(
        linkEls,
        { y: 22, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.045,
          ease: "power3.out",
        },
        0.24
      );

      if (cardsSectionRef.current) {
        tl.fromTo(
          cardsSectionRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
          0.32
        );
      }

      tl.fromTo(
        cardEls,
        { y: 36, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.55,
          stagger: 0.065,
          ease: "expo.out",
        },
        0.36
      );
    } else if (hasOpenedRef.current) {
      const endW = !isMobile && compact ? compact.offsetWidth : expanded.offsetWidth;
      const endH = !isMobile && compact ? compact.offsetHeight : 0;

      const tl = gsap.timeline({
        onComplete: () => {
          if (!isMobile) {
            gsap.set(wrapper, { clearProps: "width,height,opacity,pointerEvents" });
          } else {
            gsap.set(wrapper, { height: 0, opacity: 0, pointerEvents: "none" });
          }
          gsap.set(expanded, { opacity: 0, pointerEvents: "none" });
        },
      });

      tl.to(
        [...cardEls, cardsSectionRef.current],
        {
          y: 12,
          opacity: 0,
          duration: 0.22,
          ease: "power2.in",
        },
        0
      );

      tl.to(
        linkEls,
        {
          y: -10,
          opacity: 0,
          duration: 0.2,
          stagger: 0.02,
          ease: "power2.in",
        },
        0.04
      );

      tl.to(
        expanded,
        {
          opacity: 0,
          duration: 0.22,
          ease: "power2.inOut",
        },
        0.14
      );

      tl.to(
        wrapper,
        {
          width: endW,
          height: endH,
          opacity: isMobile ? 0 : 1,
          duration: 0.62,
          ease: "expo.inOut",
        },
        0.08
      );

      if (!isMobile && compact) {
        tl.to(
          compact,
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: "power3.out",
            pointerEvents: "auto",
          },
          0.36
        );
      }
    }
  }, [menu]);

  return (
    <>
      {/* Background Blur Overlay */}
      <AnimatePresence>
        {menu && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setMenu(false)}
            className="fixed inset-0 z-40 bg-black/25 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-lv ${hidden && !menu ? "-translate-y-full" : ""
          } ${ready ? "" : "opacity-0"}`}
      >
        <div className="lv-wrap relative flex h-20 items-start justify-between pt-3 md:pt-0">
          {/* LEFT: Brand Logo */}
          <div className="flex h-14 items-center md:h-20">
            <Link
              href="/interior"
              className="flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-lg tracking-tight shadow-xs backdrop-blur-md md:bg-transparent md:px-0 md:py-0 md:shadow-none md:backdrop-blur-none"
              aria-label={`${interior.meta.brandFull} home`}
            >
              <svg viewBox="0 0 20 20" className="size-4" aria-hidden>
                <path
                  d="M10 0c.6 5.4 4.6 9.4 10 10-5.400.6-9.400 4.600-10 10-.6-5.400-4.600-9.400-10-10C5.400 9.400 9.400 5.400 10 0z"
                  fill="currentColor"
                />
              </svg>
              {interior.meta.brand}
            </Link>
          </div>

          {/* CENTER: Unified Apple Curve Notch (Zero-Gap Overlap + Unified Drop Shadow) */}
          <div className="pointer-events-none absolute left-1/2 top-2 z-50 -translate-x-1/2 md:top-0">
            <div
              className={`relative mx-auto transition-all duration-300 ${solid || menu
                ? "drop-shadow-[0_16px_36px_rgba(0,0,0,0.12)]"
                : "drop-shadow-[0_10px_24px_rgba(0,0,0,0.06)]"
                }`}
            >
              {/* Left Ear with 2px inner overlap buffer so zero hairline seam ever appears */}
              <svg
                className="pointer-events-none absolute right-[calc(100%-1.5px)] top-0 z-20 hidden h-8 w-[34px] text-white md:block"
                viewBox="0 0 34 32"
                fill="none"
                shapeRendering="geometricPrecision"
              >
                <path
                  d="M34 0H0C17.673 0 32 14.327 32 32H34V0Z"
                  fill="currentColor"
                />
              </svg>

              {/* Right Ear with 2px inner overlap buffer so zero hairline seam ever appears */}
              <svg
                className="pointer-events-none absolute left-[calc(100%-1.5px)] top-0 z-20 hidden h-8 w-[34px] text-white md:block"
                viewBox="0 0 34 32"
                fill="none"
                shapeRendering="geometricPrecision"
              >
                <path
                  d="M0 0H34C16.327 0 2 14.327 2 32H0V0Z"
                  fill="currentColor"
                />
              </svg>

              {/* Morphing Clip Container (No separate border/ring to avoid seam lines) */}
              <div
                ref={clipWrapperRef}
                className="relative z-10 mx-auto h-0 overflow-hidden rounded-3xl bg-white opacity-0 md:h-auto md:rounded-b-[28px] md:rounded-t-none md:opacity-100 md:pointer-events-auto"
              >
                {/* 1. COMPACT DESKTOP HORIZONTAL NAV */}
                <nav
                  ref={compactBarRef}
                  aria-label="Primary"
                  className="hidden w-max items-center gap-8 px-8 py-3.5 whitespace-nowrap md:flex"
                >
                  {interior.nav.map((n) => (
                    <Link
                      key={n.href}
                      href={n.href}
                      aria-current={isActive(path, n.href) ? "page" : undefined}
                      className="relative py-1.5 text-sm font-medium text-lv-ink/70 transition-colors hover:text-lv-ink aria-[current=page]:text-lv-ink"
                    >
                      {n.label}
                      {isActive(path, n.href) && (
                        <motion.span
                          layoutId="lv-nav-dot"
                          className="absolute inset-x-0 -bottom-0.5 mx-auto h-1 w-1 rounded-full bg-lv-ink"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 32,
                          }}
                        />
                      )}
                    </Link>
                  ))}

                  {/* Desktop Expand Trigger Button */}
                  <button
                    onClick={() => setMenu(true)}
                    aria-label="Open showcase menu"
                    className="ml-1 grid size-8 place-items-center rounded-full bg-black/5 text-lv-ink transition-colors hover:bg-black/10"
                  >
                    <span className="flex flex-col gap-1">
                      <span className="block h-px w-3.5 bg-current" />
                      <span className="block h-px w-3.5 bg-current" />
                    </span>
                  </button>
                </nav>

                {/* 2. EXPANDED MENU CONTENT */}
                <div
                  ref={expandedRef}
                  className="pointer-events-none absolute left-1/2 top-0 flex w-[92vw] max-w-[680px] -translate-x-1/2 flex-col px-5 pb-6 pt-5 opacity-0 md:px-8 md:pb-8 md:pt-5"
                >
                  {/* Top Bar inside Expanded Card */}
                  <div className="mb-4 flex items-center justify-between border-b border-black/10 pb-3">
                    <span className="flex items-center gap-2 text-sm font-medium tracking-tight text-lv-ink">
                      <svg viewBox="0 0 20 20" className="size-3.5" aria-hidden>
                        <path
                          d="M10 0c.6 5.4 4.6 9.4 10 10-5.400.6-9.400 4.600-10 10-.6-5.400-4.600-9.400-10-10C5.400 9.400 9.400 5.400 10 0z"
                          fill="currentColor"
                        />
                      </svg>
                      {interior.meta.brand}
                      <sup className="text-[10px] text-lv-ink/50">
                        (0{interior.nav.length})
                      </sup>
                    </span>

                    <button
                      onClick={() => setMenu(false)}
                      aria-label="Close menu"
                      className="grid size-7 place-items-center rounded-md bg-black/5 text-lv-ink transition-colors hover:bg-black/10"
                    >
                      <span className="relative block size-3.5">
                        <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 rotate-45 bg-current" />
                        <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 -rotate-45 bg-current" />
                      </span>
                    </button>
                  </div>

                  {/* Vertical Links List */}
                  <nav
                    aria-label="Expanded Navigation"
                    className="flex flex-col space-y-0.5"
                  >
                    {interior.nav.map((n, i) => (
                      <div
                        key={n.href}
                        ref={(el) => {
                          linksRef.current[i] = el;
                        }}
                      >
                        <Link
                          href={n.href}
                          onClick={() => setMenu(false)}
                          className={`group flex items-center justify-between py-1.5 text-2xl font-normal tracking-tight transition-colors md:text-3xl ${isActive(path, n.href)
                            ? "text-lv-ink"
                            : "text-lv-ink/60 hover:text-lv-ink"
                            }`}
                        >
                          <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                            {n.label}
                          </span>
                          {isActive(path, n.href) && (
                            <span className="size-2 rounded-full bg-lv-ink" />
                          )}
                        </Link>
                      </div>
                    ))}
                  </nav>

                  {/* Bottom 3 Site Cards (live preview) */}
                  <div ref={cardsSectionRef} className="mt-6 pt-3">
                    <div className="mb-3 flex items-center gap-2 text-xs font-medium text-lv-ink/60">
                      <span className="size-1.5 rounded-full bg-lv-ink" />
                      <span>Our sites</span>
                    </div>

                    <div className="relative">
                      {/* Slider: no scrollbar, mouse drag, touch swipe */}
                      <div
                        ref={sliderRef}
                        onScroll={syncEnd}
                        onPointerDown={onSliderDown}
                        onPointerMove={onSliderMove}
                        onPointerUp={endDrag}
                        onPointerLeave={endDrag}
                        onPointerCancel={endDrag}
                        onClickCapture={onSliderClickCapture}
                        className={`-mx-1 flex cursor-grab select-none gap-3 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:cursor-auto sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 ${dragging ? "cursor-grabbing" : "snap-x snap-mandatory"
                          }`}
                      >
                        {showcaseCards.map((card, idx) => (
                          <Link
                            key={card.id}
                            href={card.href}
                            draggable={false}
                            ref={(el) => {
                              cardsRef.current[idx] = el;
                            }}
                            onClick={() => setMenu(false)}
                            className={`group flex min-h-[210px] min-w-[210px] snap-start flex-col justify-between rounded-2xl p-4 transition-transform duration-300 hover:-translate-y-1 sm:min-w-0 ${card.bg}`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium opacity-75">
                                {card.tag}
                              </span>
                              <span
                                className={`grid size-6 place-items-center rounded-full text-xs transition-transform duration-300 group-hover:rotate-45 ${card.accent}`}
                              >
                                +
                              </span>
                            </div>

                            <div className="mt-3">
                              <SiteThumb
                                src={toEmbedUrl(card.href)}
                                active={hasOpenedMenu && !embedded}
                              />
                            </div>

                            <div className="mt-3">
                              <p className="text-lg font-medium leading-snug tracking-tight">
                                {card.title}
                              </p>
                              <p className="mt-1 line-clamp-2 text-xs opacity-75">
                                {card.subtitle}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>

                      {/* Slide arrow (phone only). At the end it flips and slides back to the start. */}
                      <button
                        type="button"
                        onClick={slideCards}
                        aria-label={atEnd ? "Slide back to first card" : "Slide to next card"}
                        className="absolute right-1 top-1/2 z-10 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-white text-lv-ink shadow-md ring-1 ring-black/5 transition-transform hover:scale-105 active:scale-95 sm:hidden"
                      >
                        <svg
                          viewBox="0 0 16 16"
                          className={`size-4 transition-transform duration-300 ${atEnd ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden
                        >
                          <path d="M6 3.5l4.5 4.5L6 12.5" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Desktop Book Consultation CTA (phone menu icon moved to the bottom island) */}
          <div className="flex h-14 items-center gap-2 md:h-20 md:gap-3">
            <Magnetic className="hidden md:inline-block" strength={0.25}>
              <button
                onClick={show}
                className="inline-flex h-10 items-center rounded-md bg-lv-ink px-5 text-sm text-white transition-colors hover:bg-lv-deep"
              >
                Book Consultation
              </button>
            </Magnetic>
          </div>
        </div>
      </header>
    </>
  );
}

export { InteriorHeader };