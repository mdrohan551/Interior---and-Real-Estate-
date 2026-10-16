import { latestPosts, interior } from "@/lib/interior";
import MaskText from "../MaskText";
import PostCard from "../PostCard";
import { ArrowLink, SectionHead } from "../ui";

export default function BlogPreview() {
  const s = interior.sections.blog;
  return (
    <section className="lv-wrap py-10 md:py-15">
      <SectionHead label={s.label} title={<MaskText text={s.title} className="lv-h2 max-w-3xl" />} />
      <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
        {latestPosts(3).map((p) => <PostCard key={p.id} p={p} />)}
      </div>
      <div className="mt-14 flex justify-center"><ArrowLink href="/interior/blog">{s.more}</ArrowLink></div>
    </section>
  );
}

export { BlogPreview };

