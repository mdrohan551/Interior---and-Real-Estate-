import Link from "next/link";
import MaskText from "./MaskText";
import HeroAside, { HeroAsideProps } from "./HeroAside";

export interface PageHeroProps {
  label: string;
  title: string;
  text?: string;
  crumbs?: { label: string; href: string }[];
  showAside?: boolean;
  asideProps?: HeroAsideProps;
}

export default function PageHero({
  label,
  title,
  text,
  crumbs,
  showAside = true,
  asideProps,
}: PageHeroProps) {
  return (
    <header className="lv-wrap pb-14 pt-32 md:pb-20 md:pt-40">
      {crumbs && (
        <nav aria-label="Breadcrumb" className="mb-8 flex gap-2 text-sm text-lv-mute">
          {crumbs.map((c, i) => (
            <span key={c.href} className="flex gap-2">
              <Link href={c.href} className="transition-colors hover:text-lv-ink">{c.label}</Link>
              {i < crumbs.length - 1 && <span aria-hidden>/</span>}
            </span>
          ))}
        </nav>
      )}

      <div className="flex flex-col gap-8 md:flex-row md:gap-0">
        {showAside && (
          <HeroAside showAgency={false}

            className={`shrink-0 md:w-64 lg:w-72 md:pr-8 lg:pr-10 md:border-r md:border-lv-line/70 ${asideProps?.className || ""}`}
          />
        )}

        <div className={`flex min-w-0 flex-1 flex-col ${showAside ? "md:pl-8 lg:pl-14" : ""}`}>
          {label && (
            <p className="mb-4 text-sm font-medium text-lv-mute">{label}</p>
          )}
          <MaskText as="h1" text={title} onScroll={false} className="lv-display" />
          {text && (
            <p className="mt-6 md:mt-8 max-w-2xl text-[15px] sm:text-base md:text-lg lg:text-xl font-normal md:font-medium leading-relaxed text-neutral-700 md:text-lv-ink/80 animate-lv-rise [animation-delay:0.5s]">
              {text}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}

export { PageHero };

