import type { Metadata } from "next";
import PageHero from "@/components/real-estate/PageHero";
import PortfolioExplorer from "@/components/real-estate/PortfolioExplorer";
import { getProjectCounts } from "@/lib/real-estate/api";
import { CATS, type CatFilter } from "@/lib/real-estate/data";

export const metadata: Metadata = { title: "Portfolio" };

export default async function PortfolioPage({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const { cat } = await searchParams;
  const initial = (CATS as readonly string[]).includes(cat ?? "") ? (cat as CatFilter) : "All";
  const counts = await getProjectCounts();
  return (
    <>
      <PageHero eyebrow="Portfolio" title="Our work, up close.">Homes, offices, restaurants and hotels across Bangladesh. Filter by category and open any project for the full story.</PageHero>
      <PortfolioExplorer initialCat={initial} counts={counts} />
    </>
  );
}
