"use client";
import type { ReactNode } from "react";
import { useLead, type Prefill } from "./leadStore";

export default function OpenLead({ children, className, prefill }: { children: ReactNode; className?: string; prefill?: Prefill }) {
  const show = useLead((s) => s.show);
  return <button type="button" onClick={() => show(prefill)} className={className}>{children}</button>;
}
