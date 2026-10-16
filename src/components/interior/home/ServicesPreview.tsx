"use client";
import { useRef } from "react";
import Link from "next/link";
import { gsap, useGSAP } from "@/components/motion/gsap";
import Photo from "@/components/ui/Photo";
import { interior, tone } from "@/lib/interior";
import MaskText from "../MaskText";
import { ArrowLink, Arrow, SectionHead } from "../ui";

export default function ServicesPreview() {
  const s = interior.sections.services;
  const root = useRef<HTMLElement>(null);
  const [first, ...rest] = interior.offers;

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(".off-card", { opacity: 0, y: 60, duration: 1.2, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: root.current, start: "top 70%", once: true } });
  }, { scope: root });

  return (
    <section ref={root} className="lv-wrap py-2 md:py-10">
      <SectionHead label={s.label} title={<MaskText text={s.title} className="lv-h2" />} />
      <div className="mt-14 grid gap-4 md:grid-cols-12">
        <Link href={first.href} className="off-card group relative flex min-h-[26rem] flex-col justify-between overflow-hidden rounded-sm bg-lv-deep p-6 text-white md:col-span-4">
          <Photo src={first.image} tone={tone(first.tone)} alt="" className="absolute inset-0 opacity-25 mix-blend-luminosity transition-transform duration-[1400ms] ease-lv group-hover:scale-110" />
          <h3 className="lv-h2 relative !text-[clamp(1.8rem,2.6vw,2.4rem)]">{first.title}</h3>
          <div className="relative">
            <p className="mb-4 max-w-sm text-sm sm:text-[15px] md:text-base font-normal md:font-medium leading-relaxed text-white/90">{first.text}</p>
            <ul className="text-sm text-white/90">{first.tags.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
        </Link>

        <div className="grid gap-4 md:col-span-8 md:grid-cols-2">
          {rest.map((o, i) => (
            <Link key={o.id} href={o.href} className={`off-card group flex min-h-[20rem] flex-col justify-between border border-lv-line bg-white p-6 transition-colors duration-500 hover:border-lv-ink ${i === 1 ? "md:mt-16" : ""}`}>
              <div className="flex items-start justify-between gap-4">
                <h3 className="lv-h3 max-w-[11rem]">{o.title}</h3>
                <Arrow className="size-5 shrink-0 transition-transform duration-500 ease-lv group-hover:translate-x-1.5" />
              </div>
              <div>
                <div className="relative mb-5 size-20 overflow-hidden rounded-sm">
                  <Photo src={o.image} tone={tone(o.tone)} alt="" className="absolute inset-0 transition-transform duration-1000 ease-lv group-hover:scale-110" />
                </div>
                <p className="mb-4 text-sm sm:text-[15px] md:text-base font-normal md:font-medium leading-relaxed text-neutral-600 md:text-neutral-700">{o.text}</p>
                <ul className="text-sm">{o.tags.map((t) => <li key={t}>{t}</li>)}</ul>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-10 md:ml-[25%]"><ArrowLink href="/interior/services">{s.more}</ArrowLink></div>
    </section>
  );
}

export { ServicesPreview };

