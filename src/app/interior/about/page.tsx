import type { Metadata } from "next";
import PageHero from "@/components/interior/PageHero";
import AboutTabs from "@/components/interior/AboutTabs";
import StatsStrip from "@/components/interior/home/StatsStrip";
import ProcessTimeline from "@/components/interior/home/ProcessTimeline";
import CtaBand from "@/components/interior/CtaBand";
import { interior } from "@/lib/interior";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <PageHero label="About" title="A studio that designs calm, well-made spaces" text={interior.about.intro} />
      <AboutTabs />
      <StatsStrip />
      <section className="lv-wrap py-24 md:py-32">
        <ul className="grid gap-10 md:grid-cols-3 md:gap-8">
          {interior.about.values.map((v) => (
            <li key={v.title} className="border-t border-lv-ink pt-6"><h3 className="lv-h3">{v.title}</h3><p className="mt-3 max-w-sm text-sm sm:text-[15px] md:text-base font-normal md:font-medium leading-relaxed text-neutral-600 md:text-neutral-700">{v.text}</p></li>
          ))}
        </ul>
      </section>
      <ProcessTimeline />
      <CtaBand />
    </>
  );
}

export { AboutPage };

