"use client";
import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLead } from "./leadStore";
import LeadForm from "./LeadForm";
import { Icon } from "./icons";
import { EASE } from "./motion";

/** Modal wrapper around <LeadForm>. Esc / backdrop click closes. */
export default function LeadOverlay() {
  const { open, hide, prefill } = useLead();
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && hide();
    document.addEventListener("keydown", key);
    document.documentElement.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", key); document.documentElement.style.overflow = ""; };
  }, [open, hide]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div key="lead" role="dialog" aria-modal="true" aria-label="Book a free consultation" data-lenis-prevent
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
          onMouseDown={(e) => e.target === e.currentTarget && hide()}
          className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-[#0c2a1d]/50 p-4 backdrop-blur-md">
          <motion.div initial={{ opacity: 0, y: 30, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 15 }} transition={{ duration: 0.4, ease: EASE }}
            className="relative my-auto w-full max-w-2xl rounded-md border border-[#1F2937]/10 bg-white p-6 shadow-xl md:p-8">
            <button type="button" onClick={hide} aria-label="Close" className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-sm border border-[#1F2937]/10 bg-[#E8F3ED] transition hover:bg-[#d6eadf]"><Icon n="close" className="h-4 w-4" /></button>
            <span className="rounded-sm bg-[#E8F3ED] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#2F7D5B]">Free consultation</span>
            <h2 className="mb-6 mt-3 text-2xl font-bold leading-tight md:text-3xl">Tell us about your space.</h2>
            <LeadForm prefill={prefill} source="real-estate-modal" onDone={hide} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
