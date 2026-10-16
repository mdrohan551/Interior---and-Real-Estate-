import Link from "next/link";
import Photo from "@/components/ui/Photo";
import { featuredProjects, interior, tone } from "@/lib/interior";
import ClipReveal from "../ClipReveal";
import MaskText from "../MaskText";
import { ArrowLink, SectionHead } from "../ui";

/** Three alternating rows. Images open as you scroll, like the reference video. */
export default function PortfolioPreview() {
  const s = interior.sections.portfolio;
  return (
    <section className="lv-wrap py-2 md:py-10">
      <SectionHead label={s.label} title={<MaskText text={s.title} className="lv-h2 max-w-3xl" />} />
      <div className="mt-16 space-y-16 md:space-y-28">
        {featuredProjects().map((p, i) => (
          <article key={p.id} className="grid items-center gap-6 md:grid-cols-12 md:gap-10">
            <ClipReveal scrub className={`rounded-sm md:col-span-8 ${i % 2 ? "md:order-2" : ""}`}>
              <Link href={`/interior/portfolio/${p.slug}`} aria-label={p.title} className="group relative block aspect-[16/10]">
                <Photo src={p.image || undefined} tone={tone(p.tone)} alt={p.title} className="absolute inset-0 transition-transform duration-[1400ms] ease-lv group-hover:scale-105" sizes="(min-width:768px) 65vw, 100vw" />
              </Link>
            </ClipReveal>
            <div className={`md:col-span-4 ${i % 2 ? "md:order-1 md:pl-12" : ""}`}>
              <h3 className="lv-h3">{p.title}</h3>
              <p className="mt-3 max-w-sm text-sm sm:text-[15px] md:text-base font-normal md:font-medium leading-relaxed text-neutral-600 md:text-neutral-700">{p.summary}</p>
              <p className="mt-3 text-xs text-lv-mute">{p.location} · {p.areaSqft.toLocaleString()} sqft</p>
              <ArrowLink href={`/interior/portfolio/${p.slug}`} className="mt-6">View</ArrowLink>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-16 flex justify-center"><ArrowLink href="/interior/portfolio">{s.more}</ArrowLink></div>
    </section>
  );
}

export { PortfolioPreview };

