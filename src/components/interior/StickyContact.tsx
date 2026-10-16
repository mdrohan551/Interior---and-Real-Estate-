"use client";
import { useEffect } from "react";
import { interior } from "@/lib/interior";
import { useInteriorContact, useInteriorReady } from "./interiorStore";

/** Desktop: always-visible phone number and "Let's Talk" button.
 *  Phone: the button lives inside the bottom notch and opens the same contact panel by event. */
export default function StickyContact() {
  const show = useInteriorContact((s) => s.show);
  const open = useInteriorContact((s) => s.open);
  const ready = useInteriorReady((s) => s.ready);

  // Phone notch "Talk" button sends this event
  useEffect(() => {
    const onShow = () => show();
    window.addEventListener("interior:contact-show", onShow);
    return () => window.removeEventListener("interior:contact-show", onShow);
  }, [show]);

  return (
    <div className={`fixed bottom-4 right-4 z-40 hidden items-center gap-2 transition-opacity duration-300 sm:bottom-6 sm:right-6 sm:flex ${open ? "pointer-events-none opacity-0" : ""} ${ready ? "animate-lv-pop [animation-delay:0.6s]" : "opacity-0"}`}>
      <a href={`tel:${interior.meta.phone.replace(/\s/g, "")}`} aria-label={`Call ${interior.meta.phone}`}
        className="hidden h-12 items-center gap-2 rounded-md border border-lv-line bg-white/90 px-5 text-sm backdrop-blur transition-colors hover:border-lv-ink sm:inline-flex">
        <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden><path d="M3.5 2h2.4l1 3-1.5 1a8 8 0 003.6 3.6l1-1.5 3 1v2.4A1.6 1.6 0 0110.4 13 9.4 9.4 0 013 5.6 1.6 1.6 0 013.5 2z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" /></svg>
        {interior.meta.phone}
      </a>
      <button onClick={show} className="relative inline-flex h-12 items-center gap-2 rounded-md bg-lv-ink px-6 text-sm text-white transition-colors hover:bg-lv-deep">
        <span className="absolute inset-0 -z-10 rounded-md border border-lv-ink/40 animate-lv-ping" aria-hidden />
        Let&apos;s Talk
      </button>
    </div>
  );
}

export { StickyContact };