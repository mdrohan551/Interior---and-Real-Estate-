"use client";
import { useState } from "react";
import Link from "next/link";
import { useMotionValueEvent, useScroll } from "motion/react";
import Pic from "./Pic";
import OpenLead from "./OpenLead";
import { MaskText } from "./motion";
import { BASE, IMG, NAV, SERVICES, SITE } from "@/lib/real-estate/data";

/** CTA band + footer, with Thirdway's "You've scrolled Ncm" counter. */
export default function Footer() {
  const { scrollY } = useScroll();
  const [cm, setCm] = useState(0);
  useMotionValueEvent(scrollY, "change", (y) => setCm(Math.round(y / 37.8)));
  const h = "mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#1F2937]/50";
  const a = "text-sm md:text-base text-[#1F2937]/75 transition hover:text-[#2F7D5B]";
  return (
    <footer id="contact" className="w-full px-5 pb-12 pt-12 md:px-8 md:pt-16 lg:px-12 xl:px-16">
      <div className="relative overflow-hidden rounded-md border border-white/20">
        <Pic src={IMG.exterior} alt="Exterior design by Imagine" sizes="100vw" className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c2a1d]/90 via-[#0c2a1d]/65 to-[#0c2a1d]/30" />
        <div className="relative px-6 py-14 md:px-12 md:py-20">
          <MaskText text="If you're looking to build an exceptional space, let's talk." className="max-w-3xl text-3xl font-semibold leading-[1.08] tracking-tight text-white md:text-5xl" />
          <div className="mt-8 flex flex-wrap gap-3">
            <OpenLead className="rounded-sm bg-[#CFEBD9] px-6 py-3 text-xs md:text-sm font-semibold uppercase tracking-wider text-[#14402e] transition hover:bg-white">Book Consultation</OpenLead>
            <a href={SITE.tel} className="rounded-sm border border-white/40 px-6 py-3 text-xs md:text-sm font-semibold uppercase tracking-wider text-white backdrop-blur-md transition hover:bg-white/15">Call {SITE.phone}</a>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-md border border-[#1F2937]/10 bg-white p-6 md:p-10">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <p className="flex items-center gap-2 text-xl font-semibold"><span className="grid h-7 w-7 place-items-center rounded-sm bg-[#2F7D5B] text-xs font-bold text-white">I</span>{SITE.name}</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#1F2937]/70">{SITE.address}</p>
          </div>
          <div><p className={h}>Explore</p><ul className="space-y-2.5">{NAV.map(([l, u]) => <li key={u}><Link href={u} className={a}>{l}</Link></li>)}</ul></div>
          <div><p className={h}>Services</p><ul className="space-y-2.5">{SERVICES.map((s) => <li key={s.slug}><Link href={`${BASE}/services/${s.slug}`} className={a}>{s.title}</Link></li>)}</ul></div>
          <div>
            <p className={h}>Contact</p>
            <ul className="space-y-2.5"><li><a href={SITE.tel} className={a}>{SITE.phone}</a></li><li><a href={`mailto:${SITE.email}`} className={a}>{SITE.email}</a></li>
              {SITE.social.map(([l, u]) => <li key={l}><a href={u} target="_blank" rel="noopener noreferrer" className={a}>{l}</a></li>)}</ul>
          </div>
        </div>
        <div className="mt-8 flex flex-col justify-between gap-3 border-t border-[#1F2937]/10 pt-5 text-xs text-[#1F2937]/50 md:flex-row">
          <p>&copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <p className="tabular-nums">You&apos;ve scrolled {cm}cm</p>
        </div>
      </div>
    </footer>
  );
}
