import Photo from "@/components/ui/Photo";
import { interior, tone } from "@/lib/interior";
import ClipReveal from "./ClipReveal";
import MaskText from "./MaskText";
import { SectionHead } from "./ui";

/** One modular block per room: kitchen, bedroom, living, bathroom, dining, study */
export default function RoomSections() {
  return (
    <section className="lv-wrap py-24 md:py-32">
      <SectionHead label="Room by room" title={<MaskText text="Every room designed as its own space" className="lv-h2 max-w-2xl" />} />
      <div className="mt-16 divide-y divide-lv-line border-y border-lv-line">
        {interior.rooms.map((r, i) => (
          <article key={r.id} id={r.id} className="grid items-center gap-8 py-10 md:grid-cols-12 md:gap-10 md:py-14">
            <div className={`md:col-span-5 ${i % 2 ? "md:order-2 md:col-start-8" : ""}`}>
              <ClipReveal className="rounded-sm"><div className="relative aspect-[4/3]"><Photo src={r.image} tone={tone(r.tone)} alt={`${r.title} interior design`} className="absolute inset-0" sizes="(min-width:768px) 40vw, 100vw" /></div></ClipReveal>
            </div>
            <div className={`md:col-span-5 ${i % 2 ? "md:order-1" : "md:col-start-7"}`}>
              <h3 className="lv-h2">{r.title}</h3>
              <p className="mt-4 max-w-lg text-[15px] sm:text-base md:text-lg font-normal md:font-medium leading-relaxed text-neutral-600 md:text-neutral-700">{r.text}</p>
              <ul className="mt-6 space-y-2 text-sm">{r.points.map((p) => <li key={p} className="flex gap-3"><span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-lv-ink" />{p}</li>)}</ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export { RoomSections };

