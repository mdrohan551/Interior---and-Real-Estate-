import type { Metadata } from "next";
import PageHero from "@/components/interior/PageHero";
import PortfolioExplorer from "@/components/interior/PortfolioExplorer";
import CtaBand from "@/components/interior/CtaBand";

export const metadata: Metadata = { title: "Portfolio" };

export default function PortfolioPage() {
  return (
    <>
      <PageHero label="Portfolio" title="Projects shaped by light, material and detail" text="Homes, offices, restaurants and cafes we have designed and delivered across Bangladesh." />
      <PortfolioExplorer />
      <CtaBand />
    </>
  );
}

export { PortfolioPage };

