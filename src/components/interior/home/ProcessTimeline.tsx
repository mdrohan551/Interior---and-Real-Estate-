"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/components/motion/gsap";
import { interior } from "@/lib/interior";
import MaskText from "../MaskText";
import { SectionHead } from "../ui";

/** Four steps joined by a line that draws as you scroll */
export default function ProcessTimeline() {
  const s = interior.sections.process;
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(".step-rule", { scaleX: 0 }, {
      scaleX: 1, transformOrigin: "left center", stagger: 1, ease: "none",
      scrollTrigger: { trigger: ".step-grid", start: "top 75%", end: "bottom 60%", scrub: 0.5 }
    });
    gsap.from(".step-item", {
      opacity: 0.15, y: 24, stagger: 0.25, duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: ".step-grid", start: "top 75%", once: true }
    });
  }, { scope: root });

  return (
    <section ref={root} className="lv-wrap py-2 md:py-10">
      <SectionHead label={s.label} title={<MaskText text={s.title} className="lv-h2 max-w-3xl" />} />
      <ol className="step-grid mt-16 grid gap-10 md:grid-cols-4 md:gap-0">
        {interior.process.map((p) => (
          <li key={p.id} className="step-item group relative pr-8 pt-8">
            <span className="absolute inset-x-0 top-0 h-px bg-lv-line" />
            <span className="step-rule absolute inset-x-0 top-0 h-px bg-lv-ink" />
            <span className="absolute left-0 top-0 size-2 -translate-y-1/2 rounded-full bg-lv-ink" />
            <p className="text-sm text-lv-mute">Step {p.step}</p>
            <h3 className="lv-h3 mt-3">{p.title}</h3>
            <p className="mt-3 max-w-[17rem] text-sm sm:text-[15px] md:text-base font-normal md:font-medium leading-relaxed text-neutral-600 md:text-neutral-700 transition-colors duration-300 group-hover:text-lv-ink">{p.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export { ProcessTimeline };

