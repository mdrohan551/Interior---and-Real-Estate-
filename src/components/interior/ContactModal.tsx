"use client";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { interior } from "@/lib/interior";
import ConsultationForm from "./ConsultationForm";
import { useInteriorContact } from "./interiorStore";

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

/** Booking modal. Rendered into document.body with a React Portal so no parent transform/blur can clip it. */
export default function ContactModal() {
  const open = useInteriorContact((s) => s.open);
  const hide = useInteriorContact((s) => s.hide);
  const mounted = useMounted();
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);

  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return hide();
      if (e.key !== "Tab" || !panel.current) return;
      const f = panel.current.querySelectorAll<HTMLElement>("a[href],button:not([disabled]),input:not([tabindex='-1']),select,textarea");
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => panel.current?.querySelector<HTMLElement>("input[name=name]")?.focus(), 450);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, [open, hide]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div data-lenis-prevent className="interior-root fixed inset-0 z-[200] flex items-end justify-center bg-transparent sm:items-center sm:p-6">
          <motion.div
            key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
            onClick={hide} className="absolute inset-0 bg-lv-ink/45 backdrop-blur-sm"
          />
          <motion.div
            key="panel" ref={panel} role="dialog" aria-modal="true" aria-labelledby="lv-modal-title"
            initial={{ opacity: 0, y: 40, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative grid max-h-[94svh] w-full max-w-5xl overflow-y-auto bg-white sm:rounded-md lg:grid-cols-5"
          >
            <aside className="flex flex-col justify-between gap-10 bg-lv-panel p-8 lg:col-span-2 lg:p-10">
              <div>
                <p className="text-sm text-lv-mute">Book a consultation</p>
                <h2 id="lv-modal-title" className="lv-h2 mt-4">{interior.contact.title}</h2>
                <p className="mt-4 text-sm sm:text-[15px] md:text-base font-normal md:font-medium leading-relaxed text-neutral-600 md:text-neutral-700">{interior.contact.text}</p>
              </div>
              <div className="space-y-1 text-sm">
                <a href={`tel:${interior.meta.phone.replace(/\s/g, "")}`} className="block text-lg transition-colors hover:text-lv-deep">{interior.meta.phone}</a>
                <a href={`mailto:${interior.meta.email}`} className="block text-lv-mute transition-colors hover:text-lv-ink">{interior.meta.email}</a>
              </div>
            </aside>
            <div className="p-8 lg:col-span-3 lg:p-10">
              <button onClick={hide} aria-label="Close" className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-lv-line bg-white transition-colors hover:border-lv-ink">
                <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
              </button>
              <ConsultationForm onDone={hide} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export { ContactModal };

