import { featuredProjects, interior } from "@/lib/interior";
import MaskText from "../MaskText";
import ProjectCard from "../ProjectCard";
import { SectionHead } from "../ui";

export default function ProjectIntro() {
  const [a, b] = featuredProjects();
  const s = interior.sections.project;
  return (
    <section className="lv-wrap py-2 md:py-15">
      <SectionHead label={s.label} title={<MaskText text={s.title} className="lv-h2 max-w-3xl" />} />
      <div className="mt-1 sm:mt-14 grid gap-10 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5"><ProjectCard p={a} aspect="aspect-[4/5]" /></div>
        <div className="md:col-span-7 md:pt-24"><ProjectCard p={b} aspect="aspect-[4/3]" /></div>
      </div>
    </section>
  );
}

export { ProjectIntro };

