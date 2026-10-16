import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Photo from "@/components/ui/Photo";
import PageHero from "@/components/interior/PageHero";
import ClipReveal from "@/components/interior/ClipReveal";
import CtaBand from "@/components/interior/CtaBand";
import { ArrowLink } from "@/components/interior/ui";
import { getProject, interior, tone } from "@/lib/interior";

type Props = { params: Promise<{ slug: string }> };
export const generateStaticParams = () => interior.portfolio.items.map((p) => ({ slug: p.slug }));
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProject((await params).slug);
  return { title: p?.title, description: p?.summary };
}

export default async function ProjectDetail({ params }: Props) {
  const p = getProject((await params).slug);
  if (!p) notFound();
  const items = interior.portfolio.items;
  const next = items[(items.findIndex((x) => x.id === p.id) + 1) % items.length];
  const facts: [string, string][] = [["Location", p.location], ["Style", p.style], ["Area", `${p.areaSqft.toLocaleString()} sqft`], ["Type", p.projectType], ["Year", String(p.year)]];
  return (
    <>
      <PageHero label={p.category} title={p.title} text={p.summary} crumbs={[{ label: "Portfolio", href: "/interior/portfolio" }, { label: p.title, href: `/interior/portfolio/${p.slug}` }]} />
      <section className="lv-wrap">
        <ClipReveal className="rounded-sm"><div className="relative aspect-[16/9]"><Photo src={p.image || undefined} tone={tone(p.tone)} alt={p.title} className="absolute inset-0" sizes="100vw" priority /></div></ClipReveal>
        <div className="grid gap-12 py-20 md:grid-cols-12 md:gap-8 md:py-28">
          <dl className="divide-y divide-lv-line border-y border-lv-line text-sm md:col-span-4">
            {facts.map(([k, v]) => <div key={k} className="flex justify-between py-3"><dt className="text-lv-mute">{k}</dt><dd>{v}</dd></div>)}
          </dl>
          <p className="max-w-2xl text-[15px] sm:text-base md:text-lg lg:text-xl font-normal md:font-medium leading-relaxed text-neutral-700 md:col-span-6 md:col-start-6">{p.description}</p>
        </div>
        <div className="flex items-center justify-between border-t border-lv-line py-10">
          <ArrowLink href="/interior/portfolio">All projects</ArrowLink>
          <ArrowLink href={`/interior/portfolio/${next.slug}`}>Next: {next.title}</ArrowLink>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

export { ProjectDetail };

