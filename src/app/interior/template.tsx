"use client";
import { useEffect, type ReactNode } from "react";
import { motion } from "motion/react";
import { ScrollTrigger } from "@/components/motion/gsap";

/** Soft cross-fade between Interior pages. Opacity only, so it never breaks position: fixed or ScrollTrigger. */
export default function InteriorTemplate({ children }: { children: ReactNode }) {
  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 150);
    return () => clearTimeout(id);
  }, []);
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>{children}</motion.div>;
}

export { InteriorTemplate };

