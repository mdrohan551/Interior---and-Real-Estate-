"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useLead } from "./leadStore";
import { Icon } from "./icons";
import { EASE } from "./motion";
import { BASE, NAV, POSTS, SITE } from "@/lib/real-estate/data";

/**
 * "Dynamic island" header: transparent over the hero, then shrinks into a blurred pill on scroll.
 * Contains a "Lately at Imagine" ticker; the hamburger expands the island downward into the full menu.
 */
export default function RealEstateHeader() {
  const path = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [t, setT] = useState(0);
  const show = useLead((s) => s.show);
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 40));
  const [prevPath, setPrevPath] = useState(path);
  if (prevPath !== path) {
    setPrevPath(path);
    setOpen(false);
  }
  useEffect(() => { const id = setInterval(() => setT((n) => (n + 1) % 3), 3500); return () => clearInterval(id); }, []);

  // Listen for bottom-notch menu toggle on phones
  useEffect(() => {
    const toggle = () => setOpen((o) => !o);
    window.addEventListener("real-estate:menu-toggle", toggle);
    return () => window.removeEventListener("real-estate:menu-toggle", toggle);
  }, []);

  // Notify bottom notch of open/closed state
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("real-estate:menu-state", { detail: open }));
  }, [open]);

  const post = POSTS[t];

  return (
    <header className="fixed inset-x-0 top-5 sm:top-6 md:top-7 z-50 flex justify-center px-4 sm:px-6 md:px-8">
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1, maxWidth: scrolled && !open ? 760 : 1120 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="w-full overflow-hidden rounded-md border border-[#1F2937]/12 bg-white/95 text-[#1F2937] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.1)] backdrop-blur-xl transition-all duration-500"
      >
        <div className="flex items-center gap-3 py-2.5 pl-4 pr-2.5">
          <Link href={BASE} className="flex items-center gap-2 text-base font-semibold tracking-tight md:text-lg text-[#1F2937]">
            Real Estate
          </Link>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => show()}
              className="rounded-sm bg-[#1F2937] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#2F7D5B]"
            >
              Let&apos;s talk
            </button>
            {/* Phone header must NOT have menu icon - shown only on sm:grid and above */}
            <button
              type="button"
              aria-label="Menu"
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="hidden sm:grid h-9 w-9 place-items-center rounded-sm border border-[#1F2937]/15 bg-[#E8F3ED] text-[#1F2937] transition hover:bg-[#CFEBD9]"
            >
              <span className="relative block h-3 w-4">
                <motion.i animate={{ rotate: open ? 45 : 0, y: open ? 5 : 0 }} className="absolute left-0 top-0 h-[1.5px] w-4 bg-current" />
                <motion.i animate={{ rotate: open ? -45 : 0, y: open ? -5 : 0 }} className="absolute bottom-0 left-0 h-[1.5px] w-4 bg-current" />
              </span>
            </button>
          </div>
        </div>
        <AnimatePresence initial={false}>
          {open && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="max-h-[82vh] overflow-y-auto border-t border-[#1F2937]/10"
            >
              <div className="grid gap-6 p-6 md:grid-cols-[1.4fr_1fr] md:p-8">
                <ul>
                  {NAV.map(([l, h], i) => (
                    <motion.li key={h} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.04, duration: 0.45, ease: EASE }}>
                      <Link
                        href={h}
                        onClick={() => setOpen(false)}
                        className="group flex items-baseline gap-4 border-b border-[#1F2937]/10 py-3"
                      >
                        <span className="font-mono text-xs text-[#1F2937]/40">0{i + 1}</span>
                        <span className={`text-2xl font-semibold tracking-tight transition group-hover:translate-x-2 md:text-3xl ${path === h ? "text-[#2F7D5B]" : "text-[#1F2937]"}`}>{l}</span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
                <div className="flex flex-col justify-between space-y-4 rounded-sm border border-[#1F2937]/10 bg-[#E8F3ED]/40 p-5 text-sm text-[#1F2937]/75">
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#2F7D5B]">Imagine Studio Dhaka</p>
                    <p className="text-xs leading-relaxed">{SITE.address}</p>
                    <a href={SITE.tel} className="flex items-center gap-2 font-medium text-[#1F2937] hover:text-[#2F7D5B]"><Icon n="phone" className="h-4 w-4" />{SITE.phone}</a>
                    <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 hover:text-[#2F7D5B]"><Icon n="mail" className="h-4 w-4" />{SITE.email}</a>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setOpen(false); show(); }}
                    className="mt-4 w-full rounded-sm bg-[#2F7D5B] py-3 text-center text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#1F2937]"
                  >
                    Start Your Project
                  </button>
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
}
