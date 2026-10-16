import Link from "next/link";
import { interior } from "@/lib/interior";

export default function InteriorFooter() {
  const { meta, footer } = interior;
  return (
    <footer className="relative z-10 bg-lv-panel">
      <div className="lv-wrap grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-4">
          <p className="text-2xl tracking-tight">{meta.brandFull}</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-lv-mute">{meta.tagline}. Designing since {meta.founded}.</p>
          <ul className="mt-8 flex gap-2">
            {meta.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} aria-label={s.label} className="grid size-10 place-items-center rounded-full border border-lv-ink/15 text-xs transition-colors hover:border-lv-ink hover:bg-lv-ink hover:text-white">{s.short}</a>
              </li>
            ))}
          </ul>
        </div>

        {footer.columns.map((col) => (
          <nav key={col.title} aria-label={col.title} className="md:col-span-2">
            <p className="mb-4 text-sm text-lv-mute">{col.title}</p>
            <ul className="space-y-2.5 text-sm">
              {col.links.map((l) => (
                <li key={l.label}><Link href={l.href} className="transition-colors hover:text-lv-deep">{l.label}</Link></li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="text-sm md:col-span-4 lg:col-span-4">
          <p className="mb-4 text-sm text-lv-mute">Contact</p>
          <a href={`tel:${meta.phone.replace(/\s/g, "")}`} className="block text-lg transition-colors hover:text-lv-deep">{meta.phone}</a>
          <a href={`mailto:${meta.email}`} className="mt-1 block transition-colors hover:text-lv-deep">{meta.email}</a>
          <p className="mt-4 text-lv-mute">{meta.address}</p>
        </div>
      </div>
      <div className="lv-wrap flex flex-wrap items-center justify-between gap-3 border-t border-lv-ink/10 py-6 text-xs text-lv-mute">
        <p>© {new Date().getFullYear()} {meta.brandFull}. All rights reserved.</p>
        <ul className="flex gap-5">
          {footer.legal.map((l) => <li key={l.label}><Link href={l.href} className="transition-colors hover:text-lv-ink">{l.label}</Link></li>)}
        </ul>
      </div>
    </footer>
  );
}

export { InteriorFooter };

