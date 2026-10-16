import Link from "next/link";
import { StaggeredGrid, StaggerItem, CARD } from "./motion";
import { Icon } from "./icons";
import { BASE, PROMISES } from "@/lib/real-estate/data";

/** Big scroll-lit statement + the three promises. */
export default function Statement() {
  return (
    <section className="w-full px-5 py-10 md:px-8 md:py-16 lg:px-12 xl:px-16">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#2F7D5B]">Why Imagine Interiors</p>
          <h2 className="text-2xl font-bold tracking-tight text-[#1F2937] md:text-4xl">
            Built on trust, delivered with precision.
          </h2>
          <p className="mt-2.5 max-w-xl text-base sm:text-lg md:text-xl text-[#1F2937]/75">
            Our core commitments to transparent pricing, premium materials, and absolute on-time execution.
          </p>
        </div>
        <Link
          href={`${BASE}/about`}
          className="inline-flex items-center gap-2 rounded-sm border border-[#1F2937]/15 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#1F2937] transition hover:bg-[#CFEBD9]"
        >
          Our commitments <Icon n="arrow" className="h-4 w-4" />
        </Link>
      </div>
      <StaggeredGrid className="grid gap-5 md:grid-cols-3">
        {PROMISES.map(([t, d], i) => (
          <StaggerItem key={t}>
            <div className={`h-full p-6 md:p-8 ${CARD}`}>
              <span className="grid h-10 w-10 place-items-center rounded-sm bg-[#E8F3ED] text-xs font-mono font-bold text-[#2F7D5B]">0{i + 1}</span>
              <h3 className="mt-5 text-xl font-semibold md:text-2xl text-[#1F2937]">{t}</h3>
              <p className="mt-2.5 text-sm sm:text-base md:text-[17px] leading-relaxed text-[#1F2937]/75">{d}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggeredGrid>
    </section>
  );
}
