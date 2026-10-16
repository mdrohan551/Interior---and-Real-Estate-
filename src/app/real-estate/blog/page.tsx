import type { Metadata } from "next";
import PageHero from "@/components/real-estate/PageHero";
import BlogExplorer from "@/components/real-estate/BlogExplorer";
import { getPosts } from "@/lib/real-estate/api";

export const metadata: Metadata = { title: "Journal" };

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <>
      <PageHero eyebrow="The Imagine Journal" title="Ideas for better spaces.">Guides on styles, materials, budgets and planning, from the team behind the projects.</PageHero>
      <BlogExplorer posts={posts} />
    </>
  );
}
