import Link from "next/link";
import Photo from "@/components/ui/Photo";
import { tone, type Project } from "@/lib/interior";
import ClipReveal from "./ClipReveal";
import { Arrow } from "./ui";

/** Portfolio card: image, title, location, style and area */
export default function ProjectCard({ p, aspect = "aspect-[4/3]", reveal = true, priority }: { p: Project; aspect?: string; reveal?: boolean; priority?: boolean }) {
  const img = (
    <div className={`group/img relative overflow-hidden rounded-sm ${aspect}`}>
      <Photo src={p.image || undefined} tone={tone(p.tone)} alt={p.title} priority={priority} className="absolute inset-0 transition-transform duration-[1200ms] ease-lv group-hover:scale-105" sizes="(min-width:768px) 45vw, 100vw" />
    </div>
  );
  return (
    <Link href={`/interior/portfolio/${p.slug}`} className="group block">
      {reveal ? <ClipReveal>{img}</ClipReveal> : img}
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="lv-h3">{p.title}</h3>
          <p className="mt-1 text-sm sm:text-[15px] font-normal md:font-medium text-neutral-600 md:text-neutral-700">{p.location} · {p.style} · {p.areaSqft.toLocaleString()} sqft</p>
        </div>
        <Arrow className="mt-1 size-5 shrink-0 transition-transform duration-500 ease-lv group-hover:translate-x-1.5" />
      </div>
    </Link>
  );
}

export { ProjectCard };

