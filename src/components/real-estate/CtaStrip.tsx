import OpenLead from "./OpenLead";
import { ScrollReveal } from "./motion";
import type { Prefill } from "./leadStore";

export default function CtaStrip({ title, prefill }: { title: string; prefill?: Prefill }) {
  return (
    <section className="w-full px-5 py-10 md:px-8 md:py-14 lg:px-12 xl:px-16">
      <ScrollReveal className="flex flex-col items-start justify-between gap-6 rounded-md border border-[#2F7D5B]/20 bg-[#CFEBD9] p-6 md:flex-row md:items-center md:p-10">
        <h2 className="max-w-xl text-2xl font-bold leading-tight tracking-tight text-[#14402e] md:text-3xl">{title}</h2>
        <OpenLead prefill={prefill} className="rounded-sm bg-[#1F2937] px-6 py-3.5 text-xs md:text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-[#2F7D5B]">Book Consultation</OpenLead>
      </ScrollReveal>
    </section>
  );
}
