import Link from "next/link";
import type { ReactNode } from "react";

export const Arrow = ({ className = "size-4" }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
    <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Underlined text link with a sliding arrow */
export function ArrowLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={`group inline-flex items-center gap-2 border-b border-lv-ink/30 pb-0.5 text-sm transition-colors hover:border-lv-ink ${className}`}>
      {children}
      <Arrow className="size-3.5 transition-transform duration-500 ease-lv group-hover:translate-x-1" />
    </Link>
  );
}

const pill = "inline-flex h-12 items-center justify-center gap-2 rounded-md px-7 text-sm transition-colors duration-300";
export const btnDark = `${pill} bg-lv-ink text-white hover:bg-lv-deep`;
export const btnLight = `${pill} border border-lv-ink/20 text-lv-ink hover:border-lv-ink`;

/** Left label + right content, the page rhythm used in the reference design */
export function SectionHead({ label, title, children }: { label: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="grid gap-4 md:grid-cols-12 md:gap-8">
      <p className="text-sm text-lv-mute md:col-span-3 md:pt-3">{label}</p>
      <div className="md:col-span-9">{title}{children}</div>
    </div>
  );
}

const ui = { Arrow, ArrowLink, SectionHead, btnDark, btnLight };
export default ui;

