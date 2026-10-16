"use client";
import Magnetic from "@/components/motion/Magnetic";
import { interior } from "@/lib/interior";
import MaskText from "./MaskText";
import { useInteriorContact } from "./interiorStore";
import { Arrow } from "./ui";

export default function CtaBand() {
  const show = useInteriorContact((s) => s.show);
  return (
    <section className="lv-wrap pb-24 pt-8 md:pb-32">
      <div className="grid gap-10 rounded-sm bg-lv-ink p-8 text-white md:grid-cols-12 md:p-16">
        <MaskText text={interior.cta.title} className="lv-h2 md:col-span-8" />
        <div className="flex flex-col justify-between gap-8 md:col-span-4">
          <p className="max-w-sm text-sm sm:text-[15px] md:text-base font-normal md:font-medium leading-relaxed text-white/85">{interior.cta.text}</p>
          <div className="flex flex-wrap items-center gap-5">
            <Magnetic strength={0.2}>
              <button onClick={show} className="inline-flex h-12 items-center gap-2 rounded-md bg-white px-7 text-sm text-lv-ink transition-colors hover:bg-lv-panel">
                Book Consultation<Arrow />
              </button>
            </Magnetic>
            <a href={`tel:${interior.meta.phone.replace(/\s/g, "")}`} className="text-sm text-white/80 transition-colors hover:text-white">{interior.meta.phone}</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export { CtaBand };

