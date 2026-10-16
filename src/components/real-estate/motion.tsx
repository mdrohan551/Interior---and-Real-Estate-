"use client";
import { createElement, useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, type MotionValue, type Variants } from "motion/react";
import Pic from "./Pic";

export const EASE = [0.22, 1, 0.36, 1] as const;
/** Architectural card: clean subtle border, restrained radius, no bloated drop shadow */
export const CARD = "rounded-md border border-[#1F2937]/10 bg-white transition-all duration-300 hover:border-[#2F7D5B]/30";
const VIEW = { once: true, margin: "-80px" } as const;

/* <ScrollReveal>: fade up from below (y:50, 0.6s, apple ease) */
const TAGS = { div: motion.div, section: motion.section, article: motion.article, li: motion.li } as const;
export function ScrollReveal({ children, className, delay = 0, as = "div" }: { children: ReactNode; className?: string; delay?: number; as?: keyof typeof TAGS }) {
  const C = TAGS[as];
  return <C className={className} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEW} transition={{ duration: 0.6, ease: EASE, delay }}>{children}</C>;
}

/* <StaggeredGrid> + <StaggerItem>: children reveal one after another (0.15s) */
const grid: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.15 } } };
const item: Variants = { hidden: { opacity: 0, y: 50 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } };
export function StaggeredGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <motion.div className={className} variants={grid} initial="hidden" whileInView="show" viewport={VIEW}>{children}</motion.div>;
}
export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return <motion.div className={className} variants={item}>{children}</motion.div>;
}

/* <HoverZoomCard>: card 1.01, image 1.06 inside overflow-hidden, clean border */
export function HoverZoomCard({ src, alt, className = "", children, sizes }: { src: string; alt: string; className?: string; children?: ReactNode; sizes?: string }) {
  return (
    <motion.div initial="rest" animate="rest" whileHover="hover" variants={{ rest: { scale: 1 }, hover: { scale: 1.01 } }} transition={{ duration: 0.45, ease: EASE }}
      className={`group relative isolate overflow-hidden rounded-md border border-[#1F2937]/10 bg-white ${className}`}>
      <motion.div className="absolute inset-0" variants={{ rest: { scale: 1 }, hover: { scale: 1.06 } }} transition={{ duration: 0.8, ease: EASE }}>
        <Pic src={src} alt={alt} sizes={sizes} className="absolute inset-0" />
      </motion.div>
      <motion.div className="absolute inset-0 bg-gradient-to-t from-[#0c2a1d]/85 via-[#0c2a1d]/20 to-transparent" variants={{ rest: { opacity: 0.8 }, hover: { opacity: 0.95 } }} transition={{ duration: 0.4 }} />
      <div className="relative z-10 h-full w-full">{children}</div>
    </motion.div>
  );
}

/* <Floating>: endless gentle float */
export function Floating({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return <motion.div className={className} animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay }}>{children}</motion.div>;
}

/* <MaskText>: each word slides up out of a clipping mask (Thirdway-style text reveal) */
export function MaskText({ text, as = "h2", className = "", delay = 0 }: { text: string; as?: "h1" | "h2" | "h3" | "p"; className?: string; delay?: number }) {
  return createElement(as, { className, "aria-label": text },
    text.split(" ").map((w, i) => (
      <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.14em] pr-[0.25em] align-bottom">
        <motion.span className="inline-block" initial={{ y: "115%" }} whileInView={{ y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.9, ease: EASE, delay: delay + i * 0.05 }}>{w}</motion.span>
      </span>
    )));
}

/* <WordScroll>: words light up one by one as you scroll through a paragraph */
function Word({ w, p, a, b }: { w: string; p: MotionValue<number>; a: number; b: number }) {
  const o = useTransform(p, [a, b], [0.15, 1]);
  return <motion.span style={{ opacity: o }} className="mr-[0.25em] inline-block">{w}</motion.span>;
}
export function WordScroll({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = text.split(" ");
  return <p ref={ref} className={className}>{words.map((w, i) => <Word key={i} w={w} p={scrollYProgress} a={i / words.length} b={(i + 1) / words.length} />)}</p>;
}

/* <Marquee>: infinite horizontal loop (content is duplicated once) */
export function Marquee({ children, className = "", duration = 40 }: { children: ReactNode; className?: string; duration?: number }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <style>{"@keyframes im-marquee{to{transform:translateX(-50%)}}@media(prefers-reduced-motion:reduce){.im-marquee{animation:none!important}}"}</style>
      <div className="im-marquee flex w-max items-center" style={{ animation: `im-marquee ${duration}s linear infinite` }}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>{children}</div>
      </div>
    </div>
  );
}

/* <ParallaxImage>: image drifts slower than the page */
export function ParallaxImage({ src, alt, className = "", priority }: { src: string; alt: string; className?: string; priority?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="absolute inset-x-0 -top-[10%] h-[120%]"><Pic src={src} alt={alt} priority={priority} sizes="100vw" className="absolute inset-0" /></motion.div>
    </div>
  );
}
