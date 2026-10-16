import CountUp from "@/components/motion/CountUp";
import { interior } from "@/lib/interior";

export default function StatsStrip() {
  return (
    <section aria-label="Studio in numbers" className="lv-wrap ">
      <dl className="grid grid-cols-2 lg:grid-cols-4 bg-white rounded  border-neutral-200/80  overflow-hidden divide-x divide-y lg:divide-y-0 divide-neutral-200/70">
        {interior.stats.map((s, idx) => (
          <div
            key={s.id}
            className="group relative flex flex-col justify-between p-7 sm:p-10 text-left transition-all duration-500 hover:bg-neutral-50/80"
          >
            {/* Top Subtle Index & Dot */}
            <div className="flex items-center justify-between ">
              <span className="text-[11px] font-mono tracking-widest uppercase text-lv-mute/60">
                0{idx + 1}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-300 transition-transform duration-500 group-hover:scale-150 group-hover:bg-neutral-900" />
            </div>

            {/* Number (CountUp) */}
            <dd className="lv-h2 !text-[clamp(2.5rem,4.5vw,4.2rem)] font-light tracking-tight leading-none text-neutral-900 transition-transform duration-500 group-hover:-translate-y-1">
              <CountUp to={s.value} suffix={s.suffix} />
            </dd>

            {/* Label */}
            <dt className="mt-3 text-xs sm:text-sm font-medium uppercase tracking-[0.14em] text-lv-mute transition-colors duration-300 group-hover:text-neutral-900">
              {s.label}
            </dt>

            {/* Bottom Hover Progress Line */}
            <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-neutral-900 transition-all duration-500 ease-out group-hover:w-full" />
          </div>
        ))}
      </dl>
    </section>
  );
}

export { StatsStrip };