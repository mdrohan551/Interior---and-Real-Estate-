import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Photo from "@/components/ui/Photo";
import PageHero from "@/components/interior/PageHero";
import ClipReveal from "@/components/interior/ClipReveal";
import CtaBand from "@/components/interior/CtaBand";
import { ArrowLink } from "@/components/interior/ui";
import { getService, interior, tone } from "@/lib/interior";

type Props = { params: Promise<{ slug: string }> };
export const generateStaticParams = () => interior.services.map((s) => ({ slug: s.slug }));
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = getService((await params).slug);
  return { title: s?.title, description: s?.summary };
}

export default async function ServiceDetail({ params }: Props) {
  const s = getService((await params).slug);
  if (!s) notFound();
  const others = interior.services.filter((x) => x.id !== s.id).slice(0, 3);
  return (
    <>
      <PageHero label={s.group} title={s.title} text={s.summary} crumbs={[{ label: "Services", href: "/interior/services" }, { label: s.title, href: `/interior/services/${s.slug}` }]} />
      <section className="lv-wrap">
        <ClipReveal className="rounded-sm"><div className="relative aspect-[16/8]"><Photo src={s.image} tone={tone(s.tone)} alt={s.title} className="absolute inset-0" sizes="100vw" priority /></div></ClipReveal>
        <div className="grid gap-12 py-20 md:grid-cols-12 md:gap-8 md:py-28">
          <p className="max-w-2xl text-[15px] sm:text-base md:text-lg lg:text-xl font-normal md:font-medium leading-relaxed text-neutral-700 md:col-span-6">{s.description}</p>
          <div className="md:col-span-5 md:col-start-8">
            <h2 className="mb-4 text-sm text-lv-mute">What is included</h2>
            <ul className="divide-y divide-lv-line border-y border-lv-line text-sm">{s.includes.map((i) => <li key={i} className="py-3">{i}</li>)}</ul>
          </div>
        </div>
        <div className="border-t border-lv-line py-14">
          <h2 className="mb-8 text-sm text-lv-mute">Other services</h2>
          <ul className="grid gap-6 md:grid-cols-3">{others.map((o) => <li key={o.id}><p className="lv-h3">{o.title}</p><p className="mb-3 mt-1 text-sm text-lv-mute">{o.summary}</p><ArrowLink href={`/interior/services/${o.slug}`}>Learn more</ArrowLink></li>)}</ul>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

export { ServiceDetail };

