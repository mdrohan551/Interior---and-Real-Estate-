import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/real-estate/PageHero";
import CtaStrip from "@/components/real-estate/CtaStrip";
import ShareBar from "@/components/real-estate/ShareBar";
import Pic from "@/components/real-estate/Pic";
import { fmt } from "@/components/real-estate/JournalPreview";
import { ParallaxImage, ScrollReveal } from "@/components/real-estate/motion";
import { getPost, getRelatedPosts } from "@/lib/real-estate/api";
import { BASE, POSTS } from "@/lib/real-estate/data";

type Props = { params: Promise<{ slug: string }> };
export const generateStaticParams = () => POSTS.map((p) => ({ slug: p.slug }));
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getPost((await params).slug);
  return { title: p?.title ?? "Article", description: p?.excerpt };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const related = await getRelatedPosts(slug);
  return (
    <>
      <PageHero eyebrow={`${post.cat} · ${fmt(post.date)} · ${post.read} read`} title={post.title} />
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16"><ParallaxImage src={post.img} alt={post.title} priority className="aspect-[16/8] rounded-md border border-[#1F2937]/10" /></div>
      <article className="mx-auto max-w-3xl px-5 py-12 md:py-16">
        <ScrollReveal><p className="text-lg font-medium leading-relaxed text-[#1F2937] md:text-xl">{post.excerpt}</p></ScrollReveal>
        {post.body.map((s) => (
          <ScrollReveal key={s.h} className="mt-8">
            <h2 className="text-xl font-bold tracking-tight md:text-2xl">{s.h}</h2>
            {s.p.map((t, i) => <p key={i} className="mt-3 text-sm leading-relaxed text-[#1F2937]/75 md:text-base">{t}</p>)}
          </ScrollReveal>
        ))}
        <div className="mt-10 border-t border-[#1F2937]/10 pt-6"><ShareBar title={post.title} /></div>
      </article>
      <section className="w-full px-5 pb-16 md:px-8 lg:px-12 xl:px-16">
        <h2 className="mb-6 text-2xl font-bold tracking-tight">Keep reading</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {related.map((r) => (
            <Link key={r.slug} href={`${BASE}/blog/${r.slug}`} data-cursor="Read" className="group flex gap-4 rounded-md border border-[#1F2937]/10 bg-white p-3.5 shadow-xs transition hover:border-[#2F7D5B]/30 md:gap-5 md:p-4">
              <div className="relative aspect-square w-28 shrink-0 overflow-hidden rounded-sm md:w-36"><Pic src={r.img} alt={r.title} sizes="128px" className="absolute inset-0" imgClassName="transition-transform duration-700 group-hover:scale-105" /></div>
              <div className="flex flex-col justify-center"><p className="text-xs text-[#1F2937]/50">{fmt(r.date)}</p><h3 className="mt-1 text-base font-semibold leading-snug md:text-lg">{r.title}</h3></div>
            </Link>
          ))}
        </div>
      </section>
      <CtaStrip title="Ready to talk about your own space?" />
    </>
  );
}
