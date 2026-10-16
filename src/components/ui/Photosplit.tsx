"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/components/motion/gsap";

/**
 * Hover split / comparison layer. Rendered by <Photo splitImage /> only.
 * The divider follows the mouse; everything LEFT of the divider shows this (second) image,
 * everything RIGHT of it shows the photo underneath. When the mouse leaves, it wipes back.
 * `imageClassName` is the same class the base image has (e.g. "hero-img"), so any GSAP
 * animation on the base image also runs on this one and the two always line up.
 */
export default function PhotoSplit({
    src,
    sizes,
    imageClassName = "",
}: {
    src: string;
    sizes?: string;
    imageClassName?: string;
}) {
    const box = useRef<HTMLDivElement>(null);
    const pos = useRef({ x: 0 });

    useEffect(() => {
        const state = pos.current;
        return () => {
            gsap.killTweensOf(state);
        };
    }, []);

    const moveTo = (x: number) => {
        const el = box.current;
        if (!el) return;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        gsap.to(pos.current, {
            x,
            duration: reduce ? 0 : 0.5,
            ease: "power3.out",
            overwrite: true,
            onUpdate: () => el.style.setProperty("--split", `${pos.current.x}%`),
        });
    };

    const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
        const el = box.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100));
        el.style.setProperty("--split-o", "1");
        moveTo(x);
    };

    const onLeave = (e: React.PointerEvent<HTMLDivElement>) => {
        if (e.pointerType !== "mouse") return; // on touch, the split stays where the finger left it
        box.current?.style.setProperty("--split-o", "0");
        moveTo(0);
    };

    return (
        <div
            ref={box}
            onPointerMove={onMove}
            onPointerLeave={onLeave}
            className="absolute inset-0 z-10 touch-pan-y"
            style={{ "--split": "0%", "--split-o": "0" } as React.CSSProperties}
        >
            {/* Second image, revealed from the left edge up to the divider */}
            <div
                className="absolute inset-0"
                style={{ clipPath: "inset(0 calc(100% - var(--split)) 0 0)" }}
                aria-hidden="true"
            >
                <Image
                    src={src}
                    alt=""
                    fill
                    sizes={sizes}
                    className={`object-cover ${imageClassName}`}
                />
            </div>

            {/* Divider line + small arrows handle */}
            <div
                className="pointer-events-none absolute inset-y-0 w-px -translate-x-1/2 bg-white/90 shadow-[0_0_8px_rgba(0,0,0,0.25)] transition-opacity duration-300"
                style={{ left: "var(--split)", opacity: "var(--split-o)" }}
                aria-hidden="true"
            >
                <span className="absolute left-1/2 top-4 flex -translate-x-1/2 items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[11px] leading-none text-lv-ink shadow-sm backdrop-blur-sm">
                    <span>‹</span>
                    <span>›</span>
                </span>
            </div>
        </div>
    );
}