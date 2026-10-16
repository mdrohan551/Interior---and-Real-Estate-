import Link from "next/link";
import Photo from "@/components/ui/Photo";
import { formatDate, tone, type Post } from "@/lib/interior";
import ClipReveal from "./ClipReveal";

export default function PostCard({ p }: { p: Post }) {
  return (
    <Link href={`/interior/blog/${p.slug}`} className="group block">
      <ClipReveal>
        <div className="relative aspect-[16/10] overflow-hidden rounded-sm">
          <Photo src={p.image} tone={tone(p.tone)} alt={p.title} className="absolute inset-0 transition-transform duration-[1200ms] ease-lv group-hover:scale-105" sizes="(min-width:768px) 30vw, 100vw" />
        </div>
      </ClipReveal>
      <p className="mt-5 text-xs text-lv-mute">{formatDate(p.date)} · {p.readMin} min read</p>
      <h3 className="lv-h3 mt-2 transition-colors group-hover:text-lv-deep">{p.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm sm:text-[15px] font-normal md:font-medium leading-relaxed text-neutral-600 md:text-neutral-700">{p.excerpt}</p>
    </Link>
  );
}

export { PostCard };

