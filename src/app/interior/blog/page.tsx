import type { Metadata } from "next";
import PageHero from "@/components/interior/PageHero";
import PostCard from "@/components/interior/PostCard";
import CtaBand from "@/components/interior/CtaBand";
import { latestPosts, interior } from "@/lib/interior";

export const metadata: Metadata = { title: "Blog" };

export default function BlogPage() {
  return (
    <>
      <PageHero label="Journal" title="Ideas and guides for better interiors" text="Practical advice from our designers on planning, materials and living well." />
      <section className="lv-wrap pb-24 md:pb-32">
        <div className="grid gap-x-8 gap-y-14 md:grid-cols-3">{latestPosts(interior.blog.length).map((p) => <PostCard key={p.id} p={p} />)}</div>
      </section>
      <CtaBand />
    </>
  );
}

export { BlogPage };

