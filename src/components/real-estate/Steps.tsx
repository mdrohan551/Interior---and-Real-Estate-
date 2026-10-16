import { CARD, StaggeredGrid, StaggerItem } from "./motion";
import { STEPS } from "@/lib/real-estate/data";

export default function Steps() {
  return (
    <section className="w-full px-5 py-12 md:px-8 md:py-18 lg:px-12 xl:px-16">
      <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#2F7D5B]">How we work</p>
      <StaggeredGrid className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(([t, d], i) => (
          <StaggerItem key={t}>
            <div className={`h-full p-6 md:p-7 ${CARD}`}>
              <p className="font-mono text-3xl font-bold text-[#2F7D5B]/30 md:text-4xl">0{i + 1}</p>
              <h3 className="mt-4 text-xl font-semibold md:text-2xl text-[#1F2937]">{t}</h3>
              <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-[#1F2937]/75">{d}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggeredGrid>
    </section>
  );
}
