import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Photo from "@/components/ui/Photo";
import PageHero from "@/components/interior/PageHero";
import ClipReveal from "@/components/interior/ClipReveal";
import CtaBand from "@/components/interior/CtaBand";
import BlogSidebar from "@/components/interior/Blogsidebar";
import SocialShare from "@/components/interior/SocialShare";
import { ArrowLink } from "@/components/interior/ui";
import { formatDate, getPost, latestPosts, interior, tone } from "@/lib/interior";

type Props = { params: Promise<{ slug: string }> };

export const generateStaticParams = () => interior.blog.map((b) => ({ slug: b.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getPost((await params).slug);
  return { title: p?.title, description: p?.excerpt };
}

export default async function PostPage({ params }: Props) {
  const p = getPost((await params).slug);
  if (!p) notFound();

  // Sidebar data: other posts, formatted for the client sidebar component
  const sidebarPosts = latestPosts(interior.blog.length)
    .filter((x) => x.id !== p.id)
    .map((x) => ({
      id: x.id,
      slug: x.slug,
      title: x.title,
      excerpt: x.excerpt,
      date: formatDate(x.date),
      image: x.image,
      tone: tone(x.tone),
    }));

  return (
    <>
      {/* Page Hero: Title & Breadcrumbs */}
      <PageHero
        label={`${formatDate(p.date)} · ${p.readMin} min read`}
        title={p.title}
        crumbs={[
          { label: "Blog", href: "/interior/blog" },
          { label: "Article", href: `/interior/blog/${p.slug}` },
        ]}
      />

      {/* Main Content Grid: Image + Content on Left (8 cols), Sticky Scrollable Sidebar on Right (4 cols) */}
      <article className="lv-wrap pb-20 md:pb-28">
        <div className="grid gap-y-12 md:grid-cols-12 md:gap-x-10 lg:gap-x-12">
          {/* LEFT: Image, Social Share, Meta, Excerpt, Takeaways, Content (8 Columns) */}
          <div className="space-y-10 md:col-span-8">
            {/* Main Featured Image - Situated beside the sidebar at the top */}
            <ClipReveal className="rounded-sm overflow-hidden">
              <div className="relative aspect-[16/9] w-full">
                <Photo
                  src={p.image}
                  tone={tone(p.tone)}
                  alt={p.title}
                  className="absolute inset-0"
                  sizes="(min-width:768px) 68vw, 100vw"
                  priority
                />
              </div>
            </ClipReveal>

            {/* Title / Description Meta Bar + Social Share (Facebook, X, LinkedIn, WhatsApp, Copy Link) */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-lv-line pb-6 pt-1">
              <div className="flex items-center gap-3">
                <div className="relative size-10 shrink-0 overflow-hidden rounded-full ring-1 ring-lv-line">
                  <Photo
                    src="/avatars/avatar-2.jpg"
                    tone="stone"
                    alt="Lavish Editorial Team"
                    className="absolute inset-0"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-lv-ink">Lavish Editorial Team</p>
                  <p className="text-[11px] text-lv-mute">
                    {formatDate(p.date)} · {p.readMin} min read
                  </p>
                </div>
              </div>

              {/* Social Share Buttons */}
              <SocialShare title={p.title} />
            </div>

            {/* Excerpt Lead Callout */}
            <div className="border-l-2 border-lv-ink pl-5 py-1">
              <p className="text-xl sm:text-2xl font-light leading-relaxed text-lv-ink">
                {p.excerpt}
              </p>
            </div>

            {/* Key Takeaways & Highlights Box */}
            <div className="rounded-md border border-lv-line bg-lv-panel/80 p-6 sm:p-8">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#9c8660]">
                <span className="size-1.5 rounded-full bg-[#9c8660]" />
                Key Insights & Design Principles
              </div>
              <h3 className="mt-2 text-lg font-medium text-lv-ink">
                What every homeowner should know before planning
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-lv-ink/80">
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 text-lv-ink font-semibold">―</span>
                  <span>
                    <strong>Sightlines & Spatial Flow:</strong> Keep primary pathways clear and
                    align custom storage joinery flush with natural wall recesses.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 text-lv-ink font-semibold">―</span>
                  <span>
                    <strong>Lighting Temperature:</strong> Maintain warm-white 2700K–3000K for
                    residential spaces, separated across three independent dimmable circuits.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 text-lv-ink font-semibold">―</span>
                  <span>
                    <strong>Material Durability:</strong> In humid climates, seal natural stone
                    thoroughly and prioritize moisture-resistant marine-grade calibrated boards.
                  </span>
                </li>
              </ul>
            </div>

            {/* Article Body Paragraphs */}
            <div className="space-y-6 text-base sm:text-lg leading-relaxed text-lv-ink/90 font-light">
              {p.body.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            {/* Luxury Editorial Pull-Quote */}
            <figure className="my-10 rounded-sm border-y border-lv-line py-8 text-center sm:px-8">
              <blockquote className="text-xl sm:text-2xl font-light italic leading-relaxed text-lv-ink">
                “A well-designed interior does not demand attention; it quietly creates the
                conditions for life to unfold with grace.”
              </blockquote>
              <figcaption className="mt-3 text-xs uppercase tracking-widest text-lv-mute">
                — Lavish Architectural Philosophy
              </figcaption>
            </figure>

            {/* In-Depth Guidance & Longevity Section */}
            <div className="space-y-6 text-base sm:text-lg leading-relaxed text-lv-ink/90 font-light">
              <h2 className="lv-h3 text-xl sm:text-2xl font-normal text-lv-ink pt-2">
                Curating Longevity Over Passing Trends
              </h2>
              <p>
                When embarking on a residential or commercial interior project, the tendency is
                often to replicate momentary aesthetic trends. However, our practice has
                demonstrated that spatial clarity, balanced proportions, and tactile honesty are
                what keep a room inspiring decade after decade.
              </p>
              <p>
                By reducing visual clutter and specifying authentic natural finishes — from
                brushed brass hardware to textured limewash plaster and honed marble — the
                environment acquires a calm, grounded atmosphere that enhances everyday
                well-being.
              </p>
            </div>

            {/* Bottom Meta & Social Share */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-t border-lv-line pt-8">
              <div className="flex flex-wrap gap-2 text-xs text-lv-mute">
                <span className="rounded-full bg-lv-panel px-3 py-1 font-medium">#InteriorDesign</span>
                <span className="rounded-full bg-lv-panel px-3 py-1 font-medium">#ModernLiving</span>
                <span className="rounded-full bg-lv-panel px-3 py-1 font-medium">#Architecture</span>
                <span className="rounded-full bg-lv-panel px-3 py-1 font-medium">#CustomJoinery</span>
              </div>

              <SocialShare title={p.title} />
            </div>

            {/* Back to Blog Link */}
            <div className="pt-2">
              <ArrowLink href="/interior/blog">Back to all articles</ArrowLink>
            </div>
          </div>

          {/* RIGHT: Sticky & Independently Scrollable Sidebar (4 Columns) */}
          <div className="md:col-span-4">
            <BlogSidebar posts={sidebarPosts} />
          </div>
        </div>
      </article>

      <CtaBand />
    </>
  );
}

export { PostPage };