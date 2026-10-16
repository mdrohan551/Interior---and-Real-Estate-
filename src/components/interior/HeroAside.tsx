"use client";

import Image from "next/image";
import Link from "next/link";
import { interior } from "@/lib/interior";
import { useInteriorReady } from "./interiorStore";

export const clientAvatars = [
  "/avatars/avatar-1.jpg",
  "/avatars/avatar-2.jpg",
  "/avatars/avatar-3.jpg",
  "/avatars/avatar-4.jpg",
];

export const heroFeatures = [
  {
    title: "Unlimited Furniture",
    date: "May 2024",
    href: "/interior/portfolio",
    thumbs: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=160&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=160&q=80&auto=format&fit=crop",
    ],
  },
  {
    title: "New Interior Design Clean",
    date: "May 2024",
    href: "/interior/services",
    thumbs: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=160&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=160&q=80&auto=format&fit=crop",
    ],
  },
  {
    title: "Hot Furniture",
    date: "May 2024",
    href: "/interior/portfolio",
    thumbs: [
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=160&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=160&q=80&auto=format&fit=crop",
    ],
  },
];

export interface HeroAsideProps {
  className?: string;
  waitForIntro?: boolean;
  showAvatars?: boolean;
  showFeatures?: boolean;
  showStats?: boolean;
  showAgency?: boolean;
}

export default function HeroAside({
  className = "",
  waitForIntro = false,
  showAvatars = true,
  showFeatures = true,
  showStats = false,
  showAgency = true,
}: HeroAsideProps) {
  const h = interior.hero;
  const ready = useInteriorReady((s) => s.ready);
  const isVisible = waitForIntro ? ready : true;

  return (
    <aside
      className={`flex shrink-0 flex-col justify-around md:w-64 lg:w-72 md:pr-8 lg:pr-10 md:border-r md:border-lv-line/70 ${isVisible ? "" : "invisible"
        } ${className}`}
    >
      {/* 1. Client Avatars & Counter */}
      {showAvatars && (
        <div className="hero-fade flex items-center gap-3">
          <div className="flex -space-x-2.5">
            {clientAvatars.map((src, i) => (
              <div
                key={i}
                className="relative size-10 overflow-hidden rounded-full ring-2 ring-white shadow-xs"
              >
                <Image
                  src={src}
                  alt="Satisfied Client"
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
            ))}
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-lv-ink leading-tight">
              1,650+
            </span>
            <span className="text-[11px] font-normal text-lv-mute">
              Satisfied Clients
            </span>
          </div>
        </div>
      )}

      {/* 2. Featured Projects / Links */}
      {showFeatures && (
        <div className="hero-fade mt-6 hidden space-y-4 md:block">
          {heroFeatures.map((item, idx) => (
            <div key={item.title}>
              <Link href={item.href} className="group block">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[15px] font-medium text-lv-ink transition-colors group-hover:text-lv-deep">
                    {item.title}
                  </span>
                  <svg
                    viewBox="0 0 16 16"
                    className="size-4 shrink-0 text-lv-ink/60 transition-transform duration-300 ease-lv group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M6 3.5l4.5 4.5L6 12.5" />
                  </svg>
                </div>
                <div className="mt-1.5 flex items-center gap-2.5">
                  <div className="flex -space-x-1.5">
                    {item.thumbs.map((thumb, i) => (
                      <div
                        key={i}
                        className="relative h-4.5 w-7.5 overflow-hidden rounded-full ring-1 ring-white shadow-xs"
                      >
                        <Image
                          src={thumb}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="35px"
                        />
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-lv-mute">{item.date}</span>
                </div>
              </Link>
              {idx < heroFeatures.length - 1 && (
                <div className="mt-4 border-b border-lv-line/70" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* 3. Optional Stats Grid */}
      {showStats && (
        <div className="hero-fade mt-8 hidden md:grid md:grid-cols-2 md:gap-4">
          {interior.stats.slice(0, 4).map((s) => (
            <div key={s.id} className="rounded-md bg-white/60 px-3 py-3">
              <p className="text-xl font-light tabular-nums text-lv-ink">
                {s.value}
                {s.suffix}
              </p>
              <p className="mt-0.5 text-[10px] leading-snug text-lv-mute">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      )}


      {showAgency && (
        <div className="hero-fade mt-8 hidden max-w-[14rem] md:block">
          <p className="text-xs font-medium">{h.agency}</p>
          <p className="mt-1 text-xs leading-relaxed text-lv-mute">
            {h.agencyText}
          </p>
        </div>
      )}
    </aside>
  );
}

export { HeroAside };
