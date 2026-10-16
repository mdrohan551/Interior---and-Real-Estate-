import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Hanken_Grotesk } from "next/font/google";
import InteriorShell from "@/components/interior/InteriorShell";
import { interior } from "@/lib/interior";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-lv",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: `${interior.meta.brandFull} | Interior design in Bangladesh`, template: `%s | ${interior.meta.brandFull}` },
  description: interior.meta.tagline,
};

export default function InteriorLayout({ children }: { children: ReactNode }) {
  return (
    <div className={hanken.variable}>
      <InteriorShell>{children}</InteriorShell>
    </div>
  );
}

export { InteriorLayout };
