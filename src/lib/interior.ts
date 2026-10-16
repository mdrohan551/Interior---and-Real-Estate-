import data from "@/data/interior-data.json";
import type { Tone } from "@/components/ui/Photo";

export const interior = data;

export type Service = (typeof data.services)[number];
export type Project = (typeof data.portfolio.items)[number];
export type Post = (typeof data.blog)[number];
export type Room = (typeof data.rooms)[number];

export const tone = (t: string) => t as Tone;

export const getService = (slug: string) => data.services.find((s) => s.slug === slug);
export const getProject = (slug: string) => data.portfolio.items.find((p) => p.slug === slug);
export const getPost = (slug: string) => data.blog.find((b) => b.slug === slug);

export const featuredProjects = () => data.portfolio.items.filter((p) => p.featured);
export const latestPosts = (n = 3) => [...data.blog].sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(0, n);

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export type Enquiry = {
  name: string; phone: string; email: string;
  projectType: string; budget: string; area: string; message: string;
};

/**
 * Mock submit. Replace the body with a real request later, for example:
 *   await fetch("/api/interior/contact", { method: "POST", body: JSON.stringify(values) });
 */
export async function submitEnquiry(values: Enquiry): Promise<{ ok: true }> {
  void values;
  await new Promise((r) => setTimeout(r, 1100));
  return { ok: true };
}

export default interior;

