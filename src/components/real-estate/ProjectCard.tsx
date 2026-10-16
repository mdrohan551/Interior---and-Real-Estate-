import Link from "next/link";
import Pic from "./Pic";
import { BASE, type Project } from "@/lib/real-estate/data";

/** Image card linking to the project case study. */
export default function ProjectCard({ p, ratio = "aspect-[4/5]" }: { p: Project; ratio?: string }) {
  return (
    <Link href={`${BASE}/portfolio/${p.slug}`} data-cursor="View" className="group block">
      <div className={`relative overflow-hidden rounded-md border border-[#1F2937]/10 bg-white ${ratio}`}>
        <Pic src={p.img} alt={p.title} sizes="(min-width:1024px) 33vw, 100vw" className="absolute inset-0" imgClassName="transition-transform duration-[900ms] ease-out group-hover:scale-[1.08]" />
        <span className="absolute left-3.5 top-3.5 rounded-sm bg-white/95 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#14402e] shadow-xs backdrop-blur-md">{p.cat}</span>
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className="text-base font-semibold md:text-lg">{p.title}</h3>
        <span className="shrink-0 text-xs text-[#1F2937]/50">{p.place}</span>
      </div>
    </Link>
  );
}
