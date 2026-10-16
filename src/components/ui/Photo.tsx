import React from "react";
import Image from "next/image";
import PhotoSplit from "./Photosplit";


const TONES = {
  sand: "#d9d4c8,#f4efe6",
  stone: "#b9c7cc,#e8eef0",
  oak: "#c9b79c,#efe5d3",
  sage: "#a9b8a6,#e3eadf",
  clay: "#c98f55,#3a2a1e",
  dusk: "#2a3a46,#b08d57",
  terra: "#b85c49,#e9b9a6",
} as const;

export type Tone = keyof typeof TONES;

/**
 * Top-right cutout shape (black = area removed from the photo).
 * w  = cutout width
 * h  = height of the flat bottom edge
 * r  = radius of the two concave curves (top-left and bottom-right)
 * rb = radius of the small convex corner at the bottom-left (button radius 6px + 2px gap = 8)
 * The tile is h + r tall because the bottom-right curve runs down to the photo edge.
 */
const cutout = (w: number, h: number, r: number, rb = 15) => {
  const th = h + r;
  const d = `M 0 0 A ${r} ${r} 0 0 1 ${r} ${r} V ${h - rb} A ${rb} ${rb} 0 0 0 ${r + rb} ${h} H ${w - r} A ${r} ${r} 0 0 1 ${w} ${h + r} V 0 Z`;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${th}' viewBox='0 0 ${w} ${th}'><path d='${d}' fill='black'/></svg>`;
  return {
    url: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
    size: `${w}px ${th}px`,
  };
};

const SOLID = "linear-gradient(#000,#000)";

// Sizes are computed from the buttons so the gap is 2px on the left and bottom:
//   w = r + 2 (gap) + buttons width + right padding
//   h = top offset + button height + 2 (gap)
// Phone:   18 + 2 + (150 button + 10 gap + 40 badge) + 12 = 232 wide;  12 + 40 + 2 = 54 tall
// Desktop: 24 + 2 + (195 button + 24 gap + 48 badge) + 32 = 325 wide;  20 + 48 + 2 = 70 tall
// If you change the button/badge size or spacing in HomeHero, change these numbers too.
const SM = cutout(170, 30, 20, 14);
const MD = cutout(250, 50, 30, 22);

// Static strings so Tailwind can see them.
const MASK_CLASSES = [
  "[mask-image:var(--m-img-sm)] [-webkit-mask-image:var(--m-img-sm)]",
  "[mask-size:var(--m-size-sm)] [-webkit-mask-size:var(--m-size-sm)]",
  "md:[mask-image:var(--m-img-md)] md:[-webkit-mask-image:var(--m-img-md)]",
  "md:[mask-size:var(--m-size-md)] md:[-webkit-mask-size:var(--m-size-md)]",
  "[mask-position:right_top,0_0] [-webkit-mask-position:right_top,0_0]",
  "[mask-repeat:no-repeat] [-webkit-mask-repeat:no-repeat]",
  "[mask-composite:exclude] [-webkit-mask-composite:xor]",

].join(" ");

/**
 * Image slot. Without `src` it renders a soft gradient placeholder.
 * To use a real photo: put the file in /public and pass src="/photos/living.jpg".
 *
 * The cutout mask sits on the OUTER div (which is never animated),
 * so GSAP can scale/move the inner image (`imageClassName`) without moving the cutout.
 *
 * Hover split effect (off by default, so every other place that uses <Photo> is unchanged):
 *   <Photo splitImage images={[mainSrc, secondSrc]} ... />
 *   images[0] is the photo that shows by default, images[1] is revealed by the split as the mouse moves.
 *   Extra items in `images` are ignored.
 */
export default function Photo({
  src,
  alt,
  tone = "sand",
  className = "",
  imageClassName = "",
  sizes = "(min-width:1024px) 50vw, 100vw",
  priority,
  curveMask,
  cornersInvert,
  splitImage = false,
  images,
  children,
}: {
  src?: string;
  alt: string;
  tone?: Tone;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  curveMask?: boolean;
  cornersInvert?: boolean;
  splitImage?: boolean;
  images?: string[];
  children?: React.ReactNode;
}) {
  const pos = /\b(absolute|relative|fixed|sticky)\b/.test(className) ? "" : "relative";
  const hasCut = Boolean(curveMask || cornersInvert);

  // With splitImage, the first item of `images` is the main photo; otherwise it is just `src`.
  const baseSrc = (splitImage && images?.[0]) || src;
  const splitSrc = splitImage ? images?.[1] : undefined;

  const maskVars = hasCut
    ? ({
      "--m-img-sm": `${SM.url}, ${SOLID}`,
      "--m-size-sm": `${SM.size}, 100% 100%`,
      "--m-img-md": `${MD.url}, ${SOLID}`,
      "--m-size-md": `${MD.size}, 100% 100%`,
    } as React.CSSProperties)
    : {};

  return (
    <div
      className={`${pos} overflow-hidden  ${className} ${hasCut ? MASK_CLASSES : ""}`}
      style={{
        ...(baseSrc
          ? {}
          : {
            background: `radial-gradient(circle at 30% 28%,#fff8,transparent 45%),linear-gradient(160deg,${TONES[tone]})`,
          }),
        ...maskVars,
      }}
      role={baseSrc ? undefined : "img"}
      aria-label={baseSrc ? undefined : alt}
    >
      {baseSrc && (
        <Image
          src={baseSrc}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`object-cover  ${imageClassName}`}
        />
      )}
      {baseSrc && splitSrc && (
        <PhotoSplit src={splitSrc} sizes={sizes} imageClassName={imageClassName} />
      )}
      {children}
    </div>
  );
}