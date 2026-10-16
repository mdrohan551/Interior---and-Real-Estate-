import type { Metadata } from "next";
import Link from "next/link";
import Photo from "@/components/ui/Photo";
import PageHero from "@/components/interior/PageHero";
import ClipReveal from "@/components/interior/ClipReveal";
import RoomSections from "@/components/interior/RoomSections";
import QuoteSection from "@/components/interior/QuoteSection";
import { Arrow } from "@/components/interior/ui";
import { interior, tone } from "@/lib/interior";

export const metadata: Metadata = { title: "Services" };

export default function ServicesPage() {
  const groups = ["Residential", "Commercial"] as const;
  return (
    <>
      <PageHero label="Our Services" title="Interior design for every kind of space" text="From family homes to offices and penthouses, we plan, build and style the whole project." />
      {groups.map((g) => (
        <section key={g} className="lv-wrap pb-16 md:pb-24">
          <h2 className="mb-8 border-b border-lv-line pb-4 text-sm text-lv-mute">{g}</h2>
          <div className="grid gap-x-8 gap-y-12 md:grid-cols-2">
            {interior.services.filter((s) => s.group === g).map((s) => (
              <Link key={s.id} href={`/interior/services/${s.slug}`} className="group block">
                <ClipReveal className="rounded-sm"><div className="relative aspect-[16/10]"><Photo src={s.image} tone={tone(s.tone)} alt={s.title} className="absolute inset-0 transition-transform duration-[1200ms] ease-lv group-hover:scale-105" sizes="(min-width:768px) 45vw, 100vw" /></div></ClipReveal>
                <div className="mt-4 flex items-start justify-between gap-4">
                  <div><h3 className="lv-h3">{s.title}</h3><p className="mt-1 max-w-sm text-sm sm:text-[15px] font-normal md:font-medium leading-relaxed text-neutral-600 md:text-neutral-700">{s.summary}</p></div>
                  <Arrow className="mt-1 size-5 shrink-0 transition-transform duration-500 ease-lv group-hover:translate-x-1.5" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
      <RoomSections />
      <QuoteSection />
    </>
  );
}

export { ServicesPage };

