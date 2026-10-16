import type { ReactNode } from "react";
import { MaskText, ScrollReveal } from "./motion";

/** Title block for inner pages. */
export default function PageHero({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <section className="w-full px-5 pb-8 pt-28 md:px-8 md:pb-12 md:pt-36 lg:px-12 xl:px-16">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#2F7D5B]">{eyebrow}</p>
      <MaskText as="h1" text={title} className="max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight md:text-7xl" />
      {children && <ScrollReveal delay={0.3} className="mt-6 max-w-2xl text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed text-[#1F2937]/80">{children}</ScrollReveal>}
    </section>
  );
}
