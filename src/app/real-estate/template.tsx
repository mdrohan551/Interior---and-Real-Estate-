"use client";
import { motion } from "motion/react";

/** Re-mounts on every navigation: a white drawer glides away smoothly, revealing the page. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <motion.div
        aria-hidden
        initial={{ y: "0%" }}
        animate={{ y: "-100%" }}
        transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
        className="pointer-events-none fixed inset-0 z-[80] bg-white will-change-transform"
      />
      <motion.div
        initial={{ opacity: 0.6, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
      >
        {children}
      </motion.div>
    </>
  );
}
