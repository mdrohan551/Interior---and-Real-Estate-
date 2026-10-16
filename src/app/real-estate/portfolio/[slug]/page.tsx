import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/real-estate/PageHero";
import ProjectCard from "@/components/real-estate/ProjectCard";
import CtaStrip from "@/components/real-estate/CtaStrip";
import ShareBar from "@/components/real-estate/ShareBar";
import { ParallaxImage, ScrollReveal } from "@/components/real-estate/motion";
import { Icon } from "@/components/real-estate/icons";
import { getAdjacentProjects, getProject, getRelatedProjects } from "@/lib/real-estate/api";
import { BASE, PROJECTS, SCOPE } from "@/lib/real-estate/data";

type Props = { params: Promise<{ slug: string }> };
export const generateStaticParams = () => PROJECTS.map((p) => ({ slug: p.slug }));
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProject((await params).slug);
  return { title: p?.title ?? "Project", description: p ? `${p.cat} interior design project in ${p.place} by Imagine Interiors.` : undefined };
}

/** Project case study. Replace the generated copy with real case-study fields from your API when available. */
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const p = await getProject(slug);
  if (!p) notFound();
  const [related, { prev, next }] = await Promise.all([getRelatedProjects(slug), getAdjacentProjects(slug)]);
  const meta = [["Category", `${p.cat} Interior`], ["Location", p.place], ["Services", "Design & execution"]];
  const nav = [{ l: "Previous", t: prev, ic: "left" }, { l: "Next", t: next, ic: "right" }];
  return (
    <>
      <PageHero eyebrow={`${p.cat} project`} title={p.title} />
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16">
        <ParallaxImage src={p.img} alt={p.title} priority className="aspect-[16/9] rounded-md border border-[#1F2937]/10" />
        <dl className="mt-6 grid gap-6 border-b border-[#1F2937]/10 pb-6 sm:grid-cols-3">
          {meta.map(([k, v]) => <div key={k}><dt className="text-xs uppercase tracking-[0.2em] text-[#1F2937]/45">{k}</dt><dd className="mt-1 text-base font-semibold md:text-lg">{v}</dd></div>)}
        </dl>
      </div>
      <section className="grid w-full gap-8 px-5 py-12 md:px-8 md:py-18 lg:px-12 xl:px-16 lg:grid-cols-[1.4fr_1fr]">
        <ScrollReveal className="space-y-4 text-base leading-relaxed text-[#1F2937]/75 md:text-lg">
          <p className="text-xl font-medium leading-snug tracking-tight text-[#1F2937] md:text-3xl">A {p.cat.toLowerCase()} space designed around the people who use it every day.</p>
          <p>We began with a detailed consultation and site study to understand how the space works and what it needs to do. From there we planned layout, furniture, materials and lighting as one coherent design.</p>
          <p>Premium materials were selected for how and where they would be used, and our team carried the design through execution, inspecting every detail before handover on the agreed date.</p>
        </ScrollReveal>
        <ScrollReveal delay={0.15} className="self-start rounded-md border border-[#1F2937]/10 bg-white p-6 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2F7D5B]">Scope of work</p>
          <ul className="mt-4 space-y-2.5 text-xs md:text-sm">{SCOPE[p.cat].map((x) => <li key={x} className="flex items-center gap-2.5"><Icon n="check" className="h-4 w-4 text-[#2F7D5B]" />{x}</li>)}</ul>
        </ScrollReveal>
      </section>
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16"><ShareBar title={p.title} /></div>
      <section className="w-full px-5 py-12 md:px-8 lg:px-12 xl:px-16">
        <h2 className="mb-8 text-2xl font-bold tracking-tight md:text-4xl">More {p.cat.toLowerCase()} projects</h2>
        <div className="grid gap-5 md:grid-cols-3">{related.map((r) => <ProjectCard key={r.slug} p={r} />)}</div>
      </section>
      <nav className="grid w-full gap-4 px-5 md:px-8 lg:px-12 xl:px-16 md:grid-cols-2">
        {nav.map(({ l, t, ic }) => (
          <Link key={l} href={`${BASE}/portfolio/${t.slug}`} className="group flex items-center justify-between rounded-md border border-[#1F2937]/10 bg-white p-5 shadow-xs transition hover:border-[#2F7D5B]/30 hover:bg-[#E8F3ED]">
            <div><p className="text-xs uppercase tracking-[0.2em] text-[#1F2937]/45">{l}</p><p className="mt-1 text-base font-semibold md:text-lg">{t.title}</p></div><Icon n={ic} />
          </Link>
        ))}
      </nav>
      <CtaStrip title="Want something like this for your space?" prefill={{ service: `${p.cat} Interior` }} />
    </>
  );
}
