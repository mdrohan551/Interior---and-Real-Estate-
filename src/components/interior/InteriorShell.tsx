"use client";
import type { ReactNode } from "react";
import SmoothScroll from "@/components/motion/SmoothScroll";
import InteriorHeader from "./InteriorHeader";
import InteriorFooter from "./InteriorFooter";
import Preloader from "./Preloader";
import StickyContact from "./StickyContact";
import ContactModal from "./ContactModal";



export default function InteriorShell({ children }: { children: ReactNode }) {
  return (
    <div className="interior-root relative min-h-svh overflow-x-clip bg-white">
      <div className="lv-global-grid" aria-hidden="true" />
      <SmoothScroll lerp={0.09} />
      <Preloader />
      <InteriorHeader />
      <main className="relative z-10">{children}</main>
      <InteriorFooter />
      <div className="hidden sm:block">
        <StickyContact />
      </div>
      <ContactModal />
    </div>
  );
}

export { InteriorShell };

