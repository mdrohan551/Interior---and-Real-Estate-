import { CLIENTS, POSTS, PROJECTS, REVIEWS, SERVICES, TEAMS, type CatFilter } from "./data";

/**
 * Data access layer. Every UI component reads through these functions only.
 * To connect your existing backend, replace each body with a fetch() to your API
 * (or a TanStack Query queryFn) and keep the same return types.
 */
export async function getServices() { return SERVICES; }
export async function getService(slug: string) { return SERVICES.find((s) => s.slug === slug) ?? null; }

export async function getProjects({ cat = "All", page = 1, limit = 9 }: { cat?: CatFilter; page?: number; limit?: number } = {}) {
  const all = cat === "All" ? PROJECTS : PROJECTS.filter((p) => p.cat === cat);
  const items = all.slice((page - 1) * limit, page * limit);
  return { items, total: all.length, hasMore: page * limit < all.length };
}
export async function getProject(slug: string) { return PROJECTS.find((p) => p.slug === slug) ?? null; }
export async function getRelatedProjects(slug: string, n = 3) {
  const p = PROJECTS.find((x) => x.slug === slug);
  return PROJECTS.filter((x) => x.slug !== slug && x.cat === p?.cat).slice(0, n);
}
export async function getAdjacentProjects(slug: string) {
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  return { prev: PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length], next: PROJECTS[(i + 1) % PROJECTS.length] };
}
export async function getProjectCounts() {
  const c: Record<string, number> = { All: PROJECTS.length };
  PROJECTS.forEach((p) => (c[p.cat] = (c[p.cat] || 0) + 1));
  return c;
}

export async function getPosts() { return POSTS; }
export async function getPost(slug: string) { return POSTS.find((p) => p.slug === slug) ?? null; }
export async function getRelatedPosts(slug: string, n = 2) { return POSTS.filter((p) => p.slug !== slug).slice(0, n); }

export async function getReviews() { return REVIEWS; }
export async function getClients() { return CLIENTS; }
export async function getTeams() { return TEAMS; }
