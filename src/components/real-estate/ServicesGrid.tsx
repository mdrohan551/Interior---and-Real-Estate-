import Link from "next/link";
import { HoverZoomCard, MaskText, StaggeredGrid, StaggerItem } from "./motion";
import { Icon } from "./icons";
import { BASE, type Service } from "@/lib/real-estate/data";

/** Service cards: image zooms on hover and the description slides open. Each card opens its own service page. */
export default function ServicesGrid({ services, heading = true }: { services: Service[]; heading?: boolean }) {
  return (
    <section className="w-full px-5 py-12 md:px-8 md:py-18 lg:px-12 xl:px-16">
      {heading && (
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#2F7D5B]">What we design</p>
            <MaskText text="Find a space that fits your life." className="max-w-2xl text-3xl font-semibold leading-[1.08] tracking-tight md:text-5xl" />
            <p className="mt-3 max-w-2xl text-base sm:text-lg md:text-xl leading-relaxed text-[#1F2937]/75">
              Thoughtfully tailored architectural solutions for private duplexes, commercial workplaces, and bespoke hospitality venues across Bangladesh.
            </p>
          </div>
          <Link
            href={`${BASE}/services`}
            className="flex w-fit items-center gap-2 rounded-sm border border-[#1F2937]/15 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#1F2937] transition hover:bg-[#CFEBD9]"
          >
            All services <Icon n="arrow" className="h-4 w-4" />
          </Link>
        </div>
      )}
      <StaggeredGrid className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s, i) => (
          <StaggerItem key={s.slug}>
            <Link href={`${BASE}/services/${s.slug}`} data-cursor="Explore" className="block">
              <HoverZoomCard src={s.img} alt={s.title} className="aspect-[3/4]" sizes="(min-width:1024px) 25vw, 50vw">
                <div className="flex h-full flex-col justify-between p-5 text-white">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-white/70">0{i + 1}</span>
                    <span className="rounded-sm bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-[#14402e] shadow-xs backdrop-blur-md">
                      {s.price}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold leading-tight md:text-2xl">{s.title}</h3>
                    <p className="mt-1 text-xs font-medium text-[#CFEBD9]">{s.startingPrice}</p>
                    <div className="grid grid-rows-[0fr] transition-all duration-500 ease-out group-hover:grid-rows-[1fr]">
                      <p className="overflow-hidden text-sm leading-relaxed text-white/90 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                        <span className="block pt-3">{s.short}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </HoverZoomCard>
            </Link>
          </StaggerItem>
        ))}
      </StaggeredGrid>
    </section>
  );
}
