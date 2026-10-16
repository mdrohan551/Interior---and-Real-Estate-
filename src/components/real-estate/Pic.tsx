"use client";
import { useState } from "react";
import Image from "next/image";

/**
 * Image slot: mint gradient while loading. If the full-size file 404s it automatically retries the
 * "-400x284" WordPress thumbnail. Local images: put in /public and pass "/photos/x.jpg".
 */
export default function Pic({ src, alt, className = "", imgClassName = "", priority, sizes = "(min-width:1024px) 50vw, 100vw" }:
  { src: string; alt: string; className?: string; imgClassName?: string; priority?: boolean; sizes?: string }) {
  const [prevSrc, setPrevSrc] = useState(src);
  const [thumb, setThumb] = useState(false);
  if (prevSrc !== src) {
    setPrevSrc(src);
    setThumb(false);
  }
  const url = thumb ? src.replace(/(\.\w+)$/, "-400x284$1") : src;
  const pos = /\b(absolute|relative|fixed|sticky)\b/.test(className) ? "" : "relative";
  return (
    <div className={`${pos} overflow-hidden bg-gradient-to-br from-[#CFE5D8] to-[#E8F3ED] ${className}`}>
      <Image src={url} alt={alt} fill unoptimized priority={priority} sizes={sizes} onError={() => setThumb(true)} className={`object-cover ${imgClassName}`} />
    </div>
  );
}
