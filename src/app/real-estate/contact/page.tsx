import type { Metadata } from "next";
import PageHero from "@/components/real-estate/PageHero";
import LeadForm from "@/components/real-estate/LeadForm";
import { Icon } from "@/components/real-estate/icons";
import { ScrollReveal } from "@/components/real-estate/motion";
import { SITE } from "@/lib/real-estate/data";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  const row = "flex items-start gap-3 text-[#1F2937]/75 transition hover:text-[#2F7D5B]";
  return (
    <>
      <PageHero eyebrow="Contact" title="Let's talk about your space.">Tell us about your project and we will call you within one working day to book a free consultation.</PageHero>
      <section className="grid w-full gap-6 px-5 pb-20 md:px-8 lg:px-12 xl:px-16 lg:grid-cols-[1.2fr_1fr]">
        <ScrollReveal className="rounded-md border border-[#1F2937]/10 bg-white p-6 shadow-xs md:p-8"><LeadForm source="real-estate-contact" /></ScrollReveal>
        <ScrollReveal delay={0.15} className="space-y-6">
          <div className="space-y-4 rounded-md border border-[#1F2937]/10 bg-white p-6 shadow-xs">
            <a href={SITE.tel} className={row}><Icon n="phone" className="mt-0.5 h-4 w-4 shrink-0 text-[#2F7D5B]" />{SITE.phone}</a>
            <a href={`mailto:${SITE.email}`} className={row}><Icon n="mail" className="mt-0.5 h-4 w-4 shrink-0 text-[#2F7D5B]" />{SITE.email}</a>
            <p className={row}><Icon n="pin" className="mt-0.5 h-4 w-4 shrink-0 text-[#2F7D5B]" />{SITE.address}</p>
            <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-sm bg-[#25D366] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-xs">Chat on WhatsApp</a>
          </div>
          <iframe title="Imagine Interiors on the map" src={SITE.mapEmbed} loading="lazy" className="h-72 w-full rounded-md border border-[#1F2937]/10" />
        </ScrollReveal>
      </section>
    </>
  );
}
