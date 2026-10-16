"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { interior, tone } from "@/lib/interior";
import UIPhoto from "@/components/ui/Photo";
import { gsap, useGSAP } from "@/components/motion/gsap";
import { PROJECTS } from "@/lib/real-estate/data";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const ACCENT = "#ef4444"; // red glow used on both buttons

type Studio = {
  key: "interior" | "real-estate";
  href: string;
  label: string;
  tagline: string;
  cover: string; // colour of the circle reveal before the site opens
  images: string[];
  dir: 1 | -1; // 1 = slides left -> right, -1 = right -> left
  icon: ReactNode;
};

const INTERIOR_IMAGES = interior.portfolio.items.map((p) => p.image.replace("w=1200", "w=800")).filter(Boolean);
const REAL_ESTATE_IMAGES = PROJECTS.map((p) => p.img);

const SofaLampIcon = (
  <svg viewBox="0 0 64 48" className="h-11 w-14 sm:h-12 sm:w-16" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M10 22v-6a5 5 0 0 1 5-5h20a5 5 0 0 1 5 5v6" />
    <path d="M5 26a3.5 3.5 0 0 1 7 0v6h22v-6a3.5 3.5 0 0 1 7 0v10H5z" />
    <path d="M10 36v4M36 36v4" />
    <path d="M46 7h12l-3 12h-6z" fill={ACCENT} stroke={ACCENT} />
    <path d="M52 19v21M46 40h12" stroke={ACCENT} />
  </svg>
);

const BuildingIcon = (
  <svg viewBox="0 0 64 48" className="h-11 w-14 sm:h-12 sm:w-16" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M14 44V16l13-6v34" />
    <path d="M27 44V4l15 6v34" />
    <path d="M42 44V20h10v24" />
    <path d="M6 44h52" />
    <path d="M19 20h4M19 26h4M19 32h4M19 38h4" stroke={ACCENT} />
    <path d="M32 14h5M32 20h5M32 26h5M32 32h5M32 38h5" />
    <path d="M46 26h2M46 32h2M46 38h2" stroke={ACCENT} />
  </svg>
);

const STUDIOS: Studio[] = [
  {
    key: "interior",
    href: "/interior",
    label: "Interior",
    tagline: "Design Your Dream Space",
    cover: "#0f3347",
    images: INTERIOR_IMAGES,
    dir: 1,
    icon: SofaLampIcon,
  },
  {
    key: "real-estate",
    href: "/real-estate",
    label: "Real Estate",
    tagline: "Find Your Perfect Property",
    cover: "#1f5a41",
    images: REAL_ESTATE_IMAGES,
    dir: -1,
    icon: BuildingIcon,
  },
];

/* ------------------------------------------------------------------ */
/* 3D photo carousel band                                              */
/* ------------------------------------------------------------------ */

const MAX_CARDS = 9;
const SECONDS_PER_CARD = 4.2;

function Photo({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  // Real-estate files sometimes only exist as the -400x284 thumbnail
  const url = failed ? src.replace(/(\.\w+)$/, "-400x284$1") : src;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt=""
      loading="eager"
      draggable={false}
      onError={() => !failed && setFailed(true)}
      className="h-full w-full rounded-2xl bg-neutral-900 object-cover"
    />
  );
}

/**
 * One band of project photos on a curved 3D wall. The photo in the middle is big and sharp,
 * the ones on the sides are turned inward, smaller and blurred. They slide forever.
 */
function Band({ images, dir, align }: { images: string[]; dir: 1 | -1; align: "top" | "bottom" }) {
  const reduce = useReducedMotion();
  const holderRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [size, setSize] = useState({ w: 360, h: 240 });

  // need enough cards to loop smoothly
  const list = Array.from({ length: Math.max(7, Math.min(MAX_CARDS, images.length)) }, (_, i) => images[i % images.length]);

  useEffect(() => {
    const el = holderRef.current;
    if (!el) return;
    const update = () => {
      const h = el.clientHeight;
      const w = Math.min(h * 1.5, el.clientWidth * 0.46);
      setSize({ w: Math.round(w), h: Math.round(h) });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const n = list.length;
    const step = size.w * 0.95;
    const total = n * step;
    const start = performance.now();
    let raf = 0;

    const paint = (now: number) => {
      const off = reduce ? 0 : ((now - start) / 1000 / SECONDS_PER_CARD) * step;
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        let x = (i * step + dir * off) % total;
        if (x < 0) x += total;
        if (x > total / 2) x -= total;
        const d = x / step;
        const ad = Math.abs(d);
        if (ad > 3.4) {
          el.style.visibility = "hidden";
          return;
        }
        const rot = Math.max(-58, Math.min(58, -d * 40));
        const scale = 1 - Math.min(ad, 3) * 0.09;
        el.style.visibility = "visible";
        el.style.transform = `translate3d(${x}px,0,${-ad * 90}px) rotateY(${rot}deg) scale(${scale})`;
        el.style.opacity = String(Math.max(0, 1 - ad * 0.2));
        el.style.filter = `blur(${Math.max(0, ad - 0.35) * 3.2}px) brightness(${1 - Math.min(ad, 3) * 0.12})`;
        el.style.zIndex = String(100 - Math.round(ad * 10));
      });
      if (!reduce) raf = requestAnimationFrame(paint);
    };
    raf = requestAnimationFrame(paint);
    return () => cancelAnimationFrame(raf);
  }, [list.length, size.w, dir, reduce]);

  return (
    <section className="relative overflow-hidden">
      <div
        ref={holderRef}
        className={`absolute inset-x-0 h-[84%] ${align === "top" ? "top-[3%]" : "bottom-[3%]"}`}
        style={{ perspective: 1500, perspectiveOrigin: "50% 50%" }}
        aria-hidden
      >
        {list.map((src, i) => (
          <div
            key={i}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="absolute top-0 will-change-transform [backface-visibility:hidden]"
            style={{
              left: "50%",
              width: size.w,
              height: size.h,
              marginLeft: -size.w / 2,
              visibility: "hidden",
              boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
              borderRadius: 16,
            }}
          >
            <Photo src={src} />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Studio preloader inside circular reveal                             */
/* ------------------------------------------------------------------ */

function StudioLoader({
  words,
  image,
  tone: imageTone,
  onDone,
}: {
  words: [string, string];
  image: string;
  tone: "stone" | "sage" | "sand" | "oak" | "clay" | "dusk" | "terra";
  onDone: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [a, b] = words;

  useGSAP(() => {
    if (reduce) {
      onDone();
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: "power4.inOut" },
    });

    tl.from(".studio-pl-word", {
      yPercent: 115,
      duration: 0.8,
      stagger: 0.08,
      ease: "power4.out",
      delay: 0.12,
    })
      .fromTo(
        ".studio-pl-img",
        { width: 0 },
        { width: "clamp(4.5rem, 11vw, 9rem)", duration: 0.85 },
        "-=0.4"
      )
      // Call onDone early while words are in center so Next.js navigates in background
      .call(() => {
        onDone();
      }, undefined, "+=0.15")
      // Words slide up and photo collapses
      .to(".studio-pl-word", { yPercent: -115, duration: 0.45, stagger: 0.05 }, "+=0.15")
      .to(".studio-pl-img", { height: 0, duration: 0.4 }, "<")
      // The white drawer lifts up WITH the words leaving! No holding!
      .to(root.current, { yPercent: -100, duration: 0.5, ease: "power4.inOut" }, "-=0.35");
  }, { scope: root, dependencies: [reduce] });

  return (
    <div
      ref={root}
      className="fixed inset-0 z-50 grid place-items-center bg-white text-neutral-900 will-change-transform"
    >
      <div className="flex items-center gap-[clamp(0.5rem,2vw,1.5rem)] text-[clamp(2.2rem,7vw,5rem)] font-light tracking-tight">
        <span className="overflow-hidden py-[0.08em]">
          <span className="studio-pl-word block">{a}</span>
        </span>
        <span className="studio-pl-img relative block h-[clamp(4.5rem,11vw,9rem)] w-0 overflow-hidden">
          <UIPhoto
            src={image}
            tone={imageTone}
            alt="Studio preview"
            priority
            className="absolute inset-0"
          />
        </span>
        <span className="overflow-hidden py-[0.08em]">
          <span className="studio-pl-word block">{b}</span>
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Entry screen                                                        */
/* ------------------------------------------------------------------ */

export default function StudioPopup() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [enter, setEnter] = useState<{ studio: Studio; x: number; y: number } | null>(null);
  const pushed = useRef(false);

  const open = (e: MouseEvent<HTMLAnchorElement>, studio: Studio) => {
    e.preventDefault();
    const r = e.currentTarget.getBoundingClientRect();
    const keyboard = e.clientX === 0 && e.clientY === 0;
    router.prefetch(studio.href);
    pushed.current = false;
    if (studio.key === "interior") {
      sessionStorage.removeItem("lv-intro-seen");
      sessionStorage.removeItem("lv-curtain-lift");
    }
    setEnter({
      studio,
      x: keyboard ? r.left + r.width / 2 : e.clientX,
      y: keyboard ? r.top + r.height / 2 : e.clientY,
    });
  };

  const done = () => {
    if (!enter || pushed.current) return;
    pushed.current = true;
    router.push(enter.studio.href);
  };

  return (
    <main className="fixed inset-0 overflow-hidden bg-[#06070a]">
      {/* top band = Interior (left -> right), bottom band = Real Estate (right -> left) */}
      <div className="absolute inset-0 grid grid-rows-2">
        <Band images={STUDIOS[0].images} dir={STUDIOS[0].dir} align="top" />
        <Band images={STUDIOS[1].images} dir={STUDIOS[1].dir} align="bottom" />
      </div>

      {/* dark vignette + floor fade so the photos melt into the background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.75)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-black/10 backdrop-blur-[1px]" />

      {/* two glass buttons */}
      <div className="absolute inset-0 z-20 flex items-center justify-center gap-4 p-4 sm:gap-8">
        {STUDIOS.map((s, i) => (
          <motion.div
            key={s.key}
            initial={reduce ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href={s.href}
              onClick={(e) => open(e, s)}
              aria-label={`Open ${s.label}`}
              className="group relative flex w-[min(43vw,240px)] flex-col items-center overflow-hidden rounded-2xl border border-white/20 px-3 pb-5 pt-5 text-center text-white shadow-[0_25px_70px_rgba(0,0,0,0.6)] outline-none backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-red-400/60 focus-visible:ring-2 focus-visible:ring-white sm:px-5 sm:pb-6 sm:pt-7"
              style={{
                background: `radial-gradient(120% 90% at 0% 0%, rgba(239,68,68,0.55), transparent 55%), radial-gradient(110% 90% at 100% 100%, rgba(239,68,68,0.38), transparent 55%), rgba(255,255,255,0.07)`,
              }}
            >
              {/* glass shine */}
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" aria-hidden />
              <span
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: "radial-gradient(80% 70% at 50% 0%, rgba(239,68,68,0.28), transparent 70%)" }}
                aria-hidden
              />

              <span className="relative transition-transform duration-500 group-hover:scale-110">{s.icon}</span>
              <span className="relative mt-3 text-xl font-semibold tracking-wide sm:text-2xl">{s.label}</span>
              <span className="relative mt-1 text-[11px] text-white/70 sm:text-xs">{s.tagline}</span>

              <span
                className="relative mt-4 grid h-8 w-10 place-items-center rounded-lg border transition-all duration-500 group-hover:w-14 group-hover:bg-red-500 group-hover:text-white sm:mt-5"
                style={{ borderColor: ACCENT, color: "white", background: "rgba(239,68,68,0.12)" }}
                aria-hidden
              >
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Circle reveal in pure white for both studios */}
      <AnimatePresence>
        {enter && (
          <motion.div
            className="fixed inset-0 z-50 overflow-hidden"
            initial={{ clipPath: `circle(0% at ${enter.x}px ${enter.y}px)` }}
            animate={{ clipPath: `circle(150% at ${enter.x}px ${enter.y}px)` }}
            transition={{ duration: reduce ? 0 : 0.65, ease: [0.7, 0, 0.2, 1] }}
          >
            {enter.studio.key === "interior" ? (
              <StudioLoader
                words={interior.preloader.words as [string, string]}
                image={
                  (interior.preloader as { image?: string }).image ||
                  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80&auto=format&fit=crop"
                }
                tone={tone(interior.preloader.tone)}
                onDone={() => {
                  sessionStorage.setItem("lv-intro-seen", "1");
                  done();
                }}
              />
            ) : (
              <StudioLoader
                words={["Real", "Estate"]}
                image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80&auto=format&fit=crop"
                tone="sage"
                onDone={() => {
                  sessionStorage.setItem("re-skip-curtain", "1");
                  done();
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}