"use client";
import { useState, useSyncExternalStore } from "react";
import { Icon } from "./icons";

function subscribe() {
  return () => {};
}

/** Copy link + social share intents for the current page. */
export default function ShareBar({ title }: { title: string }) {
  const url = useSyncExternalStore(subscribe, () => window.location.href, () => "");
  const [ok, setOk] = useState(false);
  const b = "flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-medium transition hover:bg-[#CFEBD9]";
  const u = encodeURIComponent(url), t = encodeURIComponent(title);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-2 text-sm text-[#1F2937]/50">Share</span>
      <button type="button" className={b} onClick={async () => { await navigator.clipboard.writeText(url); setOk(true); setTimeout(() => setOk(false), 1800); }}><Icon n={ok ? "check" : "link"} className="h-4 w-4" />{ok ? "Copied" : "Copy link"}</button>
      <a className={b} target="_blank" rel="noopener noreferrer" href={`https://www.facebook.com/sharer/sharer.php?u=${u}`}>Facebook</a>
      <a className={b} target="_blank" rel="noopener noreferrer" href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`}>LinkedIn</a>
      <a className={b} target="_blank" rel="noopener noreferrer" href={`https://wa.me/?text=${t}%20${u}`}>WhatsApp</a>
    </div>
  );
}
