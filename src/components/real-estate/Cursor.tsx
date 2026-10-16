"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";

/**
 * Image hover cursor (fine pointers only).
 * Default/initial browser cursor is preserved everywhere across the site.
 * Only when hovering elements with [data-cursor] (e.g. portfolio & journal images)
 * does the styled circular badge ("View", "Explore", "Read") appear.
 */
function subscribeFinePointer(callback: () => void) {
  const mql = window.matchMedia("(pointer: fine)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getFinePointerSnapshot() {
  return window.matchMedia("(pointer: fine)").matches;
}

function getServerSnapshot() {
  return false;
}

export default function Cursor() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 500, damping: 38, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 500, damping: 38, mass: 0.35 });
  const fine = useSyncExternalStore(subscribeFinePointer, getFinePointerSnapshot, getServerSnapshot);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!fine) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement | null;
      const target = t?.closest<HTMLElement>("[data-cursor]");
      setLabel(target?.getAttribute("data-cursor") ?? null);
    };

    const leave = () => {
      setLabel(null);
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
    };
  }, [fine, x, y]);

  if (!fine) return null;

  return (
    <>
      <style>{`
        /* Only hide the native cursor when hovering over elements with custom image cursor */
        @media (pointer: fine) {
          [data-cursor], [data-cursor] * {
            cursor: none !important;
          }
        }
      `}</style>
      <motion.div
        style={{ x: sx, y: sy }}
        className="pointer-events-none fixed left-0 top-0 z-[90]"
      >
        <AnimatePresence>
          {label && (
            <motion.div
              key="image-cursor-badge"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="-translate-x-1/2 -translate-y-1/2 flex size-20 items-center justify-center rounded-full bg-[#2F7D5B] text-xs font-semibold uppercase tracking-wider text-white shadow-xl shadow-emerald-900/30"
            >
              {label}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
