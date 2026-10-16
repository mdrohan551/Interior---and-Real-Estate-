"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLead } from "./leadStore";
import { Icon } from "./icons";
import { EASE } from "./motion";
import { SITE } from "@/lib/real-estate/data";

/** Fixed bottom-right action button: WhatsApp chat, call, or the quick contact form (modal). */
export default function FloatingContact() {
  const [open, setOpen] = useState(false);
  const show = useLead((s) => s.show);
  const row = "flex items-center gap-3 rounded-sm px-3.5 py-2.5 text-xs font-semibold text-[#1F2937] transition hover:bg-[#E8F3ED]";
  return (
    <div className="fixed bottom-20 right-4 z-[60] flex flex-col items-end gap-2.5 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 12, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }} transition={{ duration: 0.3, ease: EASE }}
            className="w-64 rounded-md border border-[#1F2937]/10 bg-white p-2 shadow-lg">
            <p className="px-3 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wider text-[#1F2937]/50">Direct consultation</p>
            <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className={row}><span className="grid h-8 w-8 place-items-center rounded-sm bg-[#25D366] text-white"><Icon n="chat" className="h-3.5 w-3.5" /></span>Chat on WhatsApp</a>
            <a href={SITE.tel} className={row}><span className="grid h-8 w-8 place-items-center rounded-sm bg-[#E8F3ED] text-[#2F7D5B]"><Icon n="phone" className="h-3.5 w-3.5" /></span>{SITE.phone}</a>
            <button type="button" onClick={() => { setOpen(false); show(); }} className={`${row} w-full text-left`}><span className="grid h-8 w-8 place-items-center rounded-sm bg-[#E8F3ED] text-[#2F7D5B]"><Icon n="mail" className="h-3.5 w-3.5" /></span>Send a quick message</button>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button type="button" aria-label="Contact us" aria-expanded={open} onClick={() => setOpen((o) => !o)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        className="grid h-12 w-12 place-items-center rounded-md border border-[#2F7D5B]/30 bg-[#2F7D5B] text-white shadow-md">
        <motion.span animate={{ rotate: open ? 90 : 0 }}><Icon n={open ? "close" : "chat"} className="h-5 w-5" /></motion.span>
      </motion.button>
    </div>
  );
}
