import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/real-estate/PageHero";
import ProjectCard from "@/components/real-estate/ProjectCard";
import Steps from "@/components/real-estate/Steps";
import CtaStrip from "@/components/real-estate/CtaStrip";
import { CARD, ParallaxImage, ScrollReveal, StaggeredGrid, StaggerItem } from "@/components/real-estate/motion";
import { Icon } from "@/components/real-estate/icons";
import { getProjects, getService } from "@/lib/real-estate/api";
import { BASE, SERVICES } from "@/lib/real-estate/data";

type Props = { params: Promise<{ slug: string }> };
export const generateStaticParams = () => SERVICES.map((s) => ({ slug: s.slug }));
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = await getService((await params).slug);
  return { title: s?.title ?? "Service", description: s?.short };
}

export default async function ServicePage({ params }: Props) {
  const s = await getService((await params).slug);
  if (!s) notFound();
  const { items } = await getProjects({ cat: s.cat, limit: 3 });
  return (
    <>
      <PageHero eyebrow="Service" title={s.title}>{s.short}</PageHero>
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16"><ParallaxImage src={s.img} alt={s.title} priority className="aspect-[16/8] rounded-md border border-[#1F2937]/10" /></div>
      <section className="grid w-full gap-8 px-5 py-12 md:px-8 md:py-18 lg:px-12 xl:px-16 lg:grid-cols-[1.2fr_1fr]">
        <ScrollReveal>
          <p className="text-xl font-medium leading-snug tracking-tight md:text-3xl">{s.desc}</p>
          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <span className="rounded-sm bg-[#2F7D5B] px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white shadow-xs">{s.price}</span>
            <span className="rounded-sm border border-[#1F2937]/15 bg-white px-3 py-1.5 text-xs font-semibold text-[#14402e]">{s.startingPrice}</span>
          </div>
        </ScrollReveal>
        <StaggeredGrid className="space-y-2.5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2F7D5B]">What&apos;s included</p>
          {s.includes.map((x) => <StaggerItem key={x}><div className={`flex items-center gap-3 px-4 py-3 text-xs md:text-sm ${CARD}`}><Icon n="check" className="h-4 w-4 text-[#2F7D5B]" />{x}</div></StaggerItem>)}
        </StaggeredGrid>
      </section>
      <Steps />
      <section className="w-full px-5 py-12 md:px-8 lg:px-12 xl:px-16">
        <div className="mb-8 flex items-end justify-between"><h2 className="text-2xl font-bold tracking-tight md:text-4xl">Related projects</h2>
          <Link href={`${BASE}/portfolio?cat=${s.cat}`} className="flex items-center gap-2 rounded-sm border border-[#1F2937]/15 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#1F2937] transition hover:bg-[#CFEBD9]">View all {s.cat} <Icon n="arrow" className="h-4 w-4" /></Link></div>
        <div className="grid gap-5 md:grid-cols-3">{items.map((p) => <ProjectCard key={p.slug} p={p} />)}</div>
      </section>
      <CtaStrip title={`Planning a ${s.title.toLowerCase()} project?`} prefill={{ service: s.leadService }} />
    </>
  );
}
