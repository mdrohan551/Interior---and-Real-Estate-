"use client";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE, MaskText } from "./motion";
import { Icon } from "./icons";
import { REVIEWS } from "@/lib/real-estate/data";

type BrandItem = {
  id: string;
  name: string;
  content: ReactNode;
};

/* ── Exact brand logos from user reference image & premier client roster ── */
const COL1_BRANDS: BrandItem[] = [
  {
    id: "sequoia",
    name: "Sequoia",
    content: (
      <div className="flex items-center justify-center gap-2">
        <span className="font-sans text-[17px] sm:text-[19px] md:text-[21px] font-black tracking-[0.16em] text-[#121212]">
          SEQUOIA
        </span>
        <svg
          className="h-5 w-5 shrink-0 text-[#121212]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.3"
          strokeLinecap="round"
        >
          <line x1="12" y1="2" x2="12" y2="22" />
          <line x1="12" y1="6" x2="20" y2="6" />
          <line x1="12" y1="11" x2="20" y2="11" />
          <line x1="12" y1="16" x2="19" y2="16" />
          <line x1="5" y1="8" x2="12" y2="11" />
          <line x1="5" y1="13" x2="12" y2="16" />
        </svg>
      </div>
    ),
  },
  {
    id: "john-laing",
    name: "John laing",
    content: (
      <span className="font-sans text-[22px] sm:text-[24px] md:text-[27px] font-black tracking-tight text-[#121212] leading-none">
        John laing
      </span>
    ),
  },
  {
    id: "capstone",
    name: "Capstone",
    content: (
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="relative h-6 w-6">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-2.5 w-2.5 rotate-45 bg-[#121212]" />
          <div className="absolute top-2 left-0.5 h-2.5 w-2.5 rotate-45 bg-[#121212]" />
          <div className="absolute top-2 right-0.5 h-2.5 w-2.5 rotate-45 bg-[#121212]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-2.5 w-2.5 rotate-45 bg-[#121212]" />
        </div>
        <span className="text-[14px] sm:text-[15px] md:text-[17px] font-semibold tracking-tight text-[#121212]">
          capstone
        </span>
      </div>
    ),
  },
  {
    id: "bashundhara",
    name: "Bashundhara Group",
    content: (
      <div className="flex flex-col items-center justify-center text-center">
        <div className="mb-1.5 flex items-center justify-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[#121212]" />
          <span className="h-3 w-3 rounded-full border-2 border-[#121212]" />
          <span className="h-2 w-2 rounded-full bg-[#121212]" />
        </div>
        <span className="font-sans text-[12px] sm:text-[13px] md:text-[15px] font-black tracking-[0.2em] text-[#121212] uppercase">
          BASHUNDHARA
        </span>
        <span className="text-[7.5px] sm:text-[8px] md:text-[9px] font-semibold tracking-[0.28em] text-[#121212]/70 uppercase">
          GROUP
        </span>
      </div>
    ),
  },
  {
    id: "siemens",
    name: "Siemens",
    content: (
      <span className="font-sans text-[18px] sm:text-[20px] md:text-[24px] font-black tracking-[0.22em] text-[#121212] uppercase">
        SIEMENS
      </span>
    ),
  },
  {
    id: "bat",
    name: "BAT Bangladesh",
    content: (
      <div className="flex flex-col items-center justify-center text-center">
        <span className="font-serif text-[20px] sm:text-[22px] md:text-[26px] font-black tracking-[0.25em] text-[#121212]">
          B·A·T
        </span>
        <span className="text-[7px] sm:text-[8px] font-semibold tracking-[0.3em] text-[#121212]/65 uppercase">
          BANGLADESH
        </span>
      </div>
    ),
  },
];

const COL2_BRANDS: BrandItem[] = [
  {
    id: "kinrise",
    name: "Kinrise",
    content: (
      <div className="flex flex-col items-center justify-center">
        <svg viewBox="0 0 160 40" className="h-7 sm:h-8 md:h-9 w-auto text-[#121212]">
          <text
            x="80"
            y="27"
            textAnchor="middle"
            fontFamily="Georgia, Cambria, serif"
            fontSize="24"
            letterSpacing="3"
            fill="currentColor"
          >
            KINRISE
          </text>
          <path
            d="M86 28 Q98 33 118 29"
            stroke="currentColor"
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
  },
  {
    id: "nyetimber",
    name: "Nyetimber",
    content: (
      <div className="flex flex-col items-center justify-center text-center">
        <span className="font-serif text-[16px] sm:text-[18px] md:text-[20px] font-medium tracking-[0.24em] text-[#121212]">
          NYETIMBER
        </span>
        <span className="mt-1 text-[7.5px] sm:text-[8px] md:text-[9px] font-semibold tracking-[0.3em] text-[#121212]/75 uppercase">
          Product of England
        </span>
      </div>
    ),
  },
  {
    id: "canary-wharf",
    name: "Canary Wharf Group",
    content: (
      <div className="flex flex-col items-center justify-center text-center">
        <svg
          className="h-8 sm:h-9 md:h-10 w-auto text-[#121212]"
          viewBox="0 0 36 36"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <rect x="13.5" y="3" width="9" height="28" />
          <line x1="16.5" y1="3" x2="16.5" y2="31" />
          <line x1="19.5" y1="3" x2="19.5" y2="31" />
          <rect x="6.5" y="9" width="7" height="22" />
          <line x1="10" y1="9" x2="10" y2="31" />
          <rect x="22.5" y="9" width="7" height="22" />
          <line x1="26" y1="9" x2="26" y2="31" />
        </svg>
        <span className="mt-1.5 text-[9px] sm:text-[10px] md:text-[11px] font-semibold tracking-[0.22em] text-[#121212] uppercase leading-tight">
          Canary Wharf
        </span>
        <span className="text-[7.5px] sm:text-[8px] md:text-[9px] font-medium tracking-[0.24em] text-[#121212]/70 uppercase">
          Group
        </span>
      </div>
    ),
  },
  {
    id: "intercontinental",
    name: "InterContinental",
    content: (
      <div className="flex flex-col items-center justify-center text-center">
        <div className="mb-0.5 text-2xl font-serif font-black tracking-widest text-[#121212]">
          I
        </div>
        <span className="font-serif text-[9px] sm:text-[10px] md:text-[11.5px] font-medium tracking-[0.22em] text-[#121212] uppercase">
          InterContinental
        </span>
        <span className="text-[6.5px] sm:text-[7.5px] font-semibold tracking-[0.28em] text-[#121212]/60 uppercase">
          Hotels & Resorts
        </span>
      </div>
    ),
  },
  {
    id: "dhaka-bank",
    name: "Dhaka Bank",
    content: (
      <div className="flex items-center justify-center gap-2">
        <div className="h-4 w-4 md:h-5 md:w-5 rounded-full border-2 border-[#121212] flex items-center justify-center text-[9px] md:text-[10px] font-black">
          D
        </div>
        <span className="font-sans text-[12px] sm:text-[13px] md:text-[15px] font-bold tracking-[0.16em] text-[#121212] uppercase">
          DHAKA BANK
        </span>
      </div>
    ),
  },
  {
    id: "workspace-co",
    name: "Workspace Co",
    content: (
      <div className="flex items-center justify-center gap-2">
        <div className="h-4 w-4 border-2 border-[#121212]" />
        <span className="font-sans text-[12px] sm:text-[13px] md:text-[15px] font-bold tracking-[0.2em] text-[#121212] uppercase">
          WORKSPACE
        </span>
      </div>
    ),
  },
];

const COL3_BRANDS: BrandItem[] = [
  {
    id: "royal-london",
    name: "Royal London",
    content: (
      <div className="flex items-center justify-center gap-2">
        <svg
          className="h-5 w-5 sm:h-6 sm:w-6 shrink-0 text-[#121212]"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M7 6C7 4.5 8 3.5 9.5 3.5C11 3.5 12 4.5 12 6C12 7 11 8 9.5 8.5C8 9 7.5 10 7.5 11.5C7.5 14 9.5 16 12 16.5C14.5 17 18 16 20 14C20.5 13.5 21 14 20.5 14.5C18.5 17 15 18.5 12 18.5C8.5 18.5 6 15.5 6 12C6 9.5 7 7.5 7 6ZM12 5C11.5 5 11 5.5 11 6C11 6.5 11.5 7 12 7C12.5 7 13 6.5 13 6C13 5.5 12.5 5 12 5ZM21 8C19 6.5 15 5.5 12 5.5V4C16 4 20.5 5 23 7C23.5 7.5 23 8.5 22 8.5L21 8Z" />
        </svg>
        <span className="font-serif text-[13px] sm:text-[14px] md:text-[16px] tracking-[0.16em] text-[#121212]">
          ROYAL LONDON
        </span>
      </div>
    ),
  },
  {
    id: "cleo",
    name: "cleo",
    content: (
      <div className="flex items-center justify-center rounded-2xl bg-[#121212] px-5 sm:px-6 py-2 sm:py-2.5 text-white shadow-xs">
        <span className="font-sans text-[20px] sm:text-[22px] md:text-[25px] font-black tracking-tight text-white leading-none">
          cleo
        </span>
      </div>
    ),
  },
  {
    id: "bam",
    name: "B.A:M:",
    content: (
      <svg viewBox="0 0 140 36" className="h-6 sm:h-7 md:h-8 w-auto text-[#121212]">
        <text
          x="70"
          y="27"
          textAnchor="middle"
          fontFamily="Georgia, Cambria, serif"
          fontSize="28"
          fontWeight="900"
          letterSpacing="3"
          fill="currentColor"
        >
          B.A:M:
        </text>
      </svg>
    ),
  },
  {
    id: "apex",
    name: "Apex",
    content: (
      <span className="font-sans text-[22px] sm:text-[24px] md:text-[28px] font-black tracking-tighter text-[#121212] italic">
        Apex
      </span>
    ),
  },
  {
    id: "conveyor",
    name: "Conveyor Group",
    content: (
      <div className="flex flex-col items-center justify-center text-center">
        <span className="font-sans text-[13px] sm:text-[14px] md:text-[16px] font-black tracking-[0.18em] text-[#121212] uppercase">
          CONVEYOR
        </span>
        <span className="text-[7.5px] sm:text-[8px] font-semibold tracking-[0.24em] text-[#121212]/70 uppercase">
          LOGISTICS & INFRA
        </span>
      </div>
    ),
  },
  {
    id: "oaktree",
    name: "Oaktree Capital",
    content: (
      <div className="flex flex-col items-center justify-center text-center">
        <span className="font-serif text-[15px] sm:text-[17px] md:text-[19px] font-semibold tracking-[0.2em] text-[#121212]">
          OAKTREE
        </span>
        <span className="text-[7px] sm:text-[8px] font-medium tracking-[0.26em] text-[#121212]/70 uppercase">
          CAPITAL PARTNERS
        </span>
      </div>
    ),
  },
];

/* Single architectural brand tile component */
function BrandCard({ item }: { item: BrandItem }) {
  return (
    <div
      className="group aspect-square w-full select-none rounded-[3px] bg-[#EAE5DD] p-4 sm:p-5 md:p-6 transition-all duration-300 hover:bg-[#E2DDD3] hover:scale-[1.015] flex flex-col items-center justify-center border border-black/[0.03] shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
      title={item.name}
    >
      <div className="flex h-full w-full items-center justify-center">
        {item.content}
      </div>
    </div>
  );
}

export default function SocialProof() {
  const [i, setI] = useState(0);

  // Auto rotate reviews every 7 seconds
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % REVIEWS.length), 7000);
    return () => clearInterval(id);
  }, []);

  const r = REVIEWS[i];

  // Duplicate arrays once for seamless infinite vertical looping
  const col1Items = [...COL1_BRANDS, ...COL1_BRANDS];
  const col2Items = [...COL2_BRANDS, ...COL2_BRANDS];
  const col3Items = [...COL3_BRANDS, ...COL3_BRANDS];

  return (
    <section id="reviews" className="w-full py-16 md:py-24 border-t border-[#1F2937]/10 bg-[#FBF9F4]">
      {/* Self-contained CSS keyframes for 60fps vertical ticker motion */}
      <style>{`
        @keyframes tickerUp {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(0, -50%, 0);
          }
        }
        @keyframes tickerDown {
          0% {
            transform: translate3d(0, -50%, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }
        .im-ticker-up-1 {
          animation: tickerUp 34s linear infinite;
        }
        .im-ticker-down-2 {
          animation: tickerDown 38s linear infinite;
        }
        .im-ticker-up-3 {
          animation: tickerUp 30s linear infinite;
        }
        .im-ticker-wrapper:hover .im-ticker-up-1,
        .im-ticker-wrapper:hover .im-ticker-down-2,
        .im-ticker-wrapper:hover .im-ticker-up-3 {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .im-ticker-up-1,
          .im-ticker-down-2,
          .im-ticker-up-3 {
            animation: none !important;
          }
        }
      `}</style>

      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          
          {/* Left Column: Heading, Metrics, and Testimonials Carousel */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#2F7D5B]">
              Social proof
            </p>
            <MaskText
              text="Trusted by 500+ happy clients & visionary brands."
              className="text-3xl font-semibold leading-[1.08] tracking-tight md:text-5xl text-[#1F2937]"
            />
            <p className="mt-4 text-base sm:text-lg md:text-xl leading-relaxed text-[#1F2937]/75">
              From landmark corporate headquarters and boutique hospitality spaces to bespoke private homes across Bangladesh, we deliver architecture and interior environments without compromise.
            </p>

            {/* Trust Metrics Bar */}
            <div className="mt-8 grid grid-cols-3 gap-3 border-y border-[#1F2937]/10 py-5">
              <div>
                <p className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1F2937]">500+</p>
                <p className="mt-1 text-xs text-[#1F2937]/65">Delivered Spaces</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2F7D5B]">100%</p>
                <p className="mt-1 text-xs text-[#1F2937]/65">On-Time & On-Budget</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1F2937]">4.9★</p>
                <p className="mt-1 text-xs text-[#1F2937]/65">Client Trust Score</p>
              </div>
            </div>

            {/* Interactive Testimonial Card */}
            <div className="mt-6 relative rounded-md border border-[#1F2937]/10 bg-white p-6 md:p-7 shadow-xs">
              <AnimatePresence mode="wait">
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <div className="flex gap-1 text-[#2F7D5B]">
                    {Array.from({ length: r.stars }).map((_, k) => (
                      <Icon key={k} n="star" className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <h3 className="mt-3 text-lg md:text-xl font-semibold text-[#1F2937] leading-snug">
                    &ldquo;{r.title}&rdquo;
                  </h3>
                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#1F2937]/75">
                    {r.text}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-[#1F2937]/10 pt-4">
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-[#1F2937]">{r.name}</p>
                      <p className="text-[11px] text-[#1F2937]/50">{r.role}</p>
                    </div>
                    {/* Navigation Buttons & Progress Dots */}
                    <div className="flex items-center gap-2">
                      <div className="hidden sm:flex gap-1 mr-2">
                        {REVIEWS.map((_, k) => (
                          <button
                            key={k}
                            aria-label={`Go to review ${k + 1}`}
                            onClick={() => setI(k)}
                            className={`h-1.5 rounded-sm transition-all duration-300 ${
                              k === i ? "w-5 bg-[#2F7D5B]" : "w-2 bg-[#1F2937]/15 hover:bg-[#1F2937]/30"
                            }`}
                          />
                        ))}
                      </div>
                      <button
                        onClick={() => setI((curr) => (curr - 1 + REVIEWS.length) % REVIEWS.length)}
                        aria-label="Previous review"
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-[#1F2937]/15 text-[#1F2937] transition hover:border-[#2F7D5B] hover:text-[#2F7D5B]"
                      >
                        <Icon n="left" className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setI((curr) => (curr + 1) % REVIEWS.length)}
                        aria-label="Next review"
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-[#1F2937]/15 text-[#1F2937] transition hover:border-[#2F7D5B] hover:text-[#2F7D5B]"
                      >
                        <Icon n="right" className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: 3-Column Vertical Animated Brand Logo Wall (as in reference image) */}
          <div className="lg:col-span-7">
            <div className="im-ticker-wrapper relative h-[480px] sm:h-[540px] md:h-[620px] lg:h-[660px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,black_14%,black_86%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_14%,black_86%,transparent_100%)]">
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 md:gap-3.5 h-full">
                
                {/* Column 1: Scrolls Up (Sequoia, John laing, capstone, ...) */}
                <div className="im-ticker-up-1 flex flex-col gap-2.5 sm:gap-3 md:gap-3.5 will-change-transform">
                  {col1Items.map((item, idx) => (
                    <BrandCard key={`c1-${item.id}-${idx}`} item={item} />
                  ))}
                </div>

                {/* Column 2: Scrolls Down & Offset (KINRISE, NYETIMBER, CANARY WHARF, ...) */}
                <div className="im-ticker-down-2 flex flex-col gap-2.5 sm:gap-3 md:gap-3.5 pt-6 sm:pt-8 md:pt-12 will-change-transform">
                  {col2Items.map((item, idx) => (
                    <BrandCard key={`c2-${item.id}-${idx}`} item={item} />
                  ))}
                </div>

                {/* Column 3: Scrolls Up at slightly faster duration (ROYAL LONDON, cleo, B.A:M:, ...) */}
                <div className="im-ticker-up-3 flex flex-col gap-2.5 sm:gap-3 md:gap-3.5 will-change-transform">
                  {col3Items.map((item, idx) => (
                    <BrandCard key={`c3-${item.id}-${idx}`} item={item} />
                  ))}
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
