import Hero from "@/components/real-estate/Hero";
import Statement from "@/components/real-estate/Statement";
import ServicesGrid from "@/components/real-estate/ServicesGrid";
import PortfolioScroller from "@/components/real-estate/PortfolioScroller";
import ImageGallery from "@/components/real-estate/ImageGallery";
import Approach from "@/components/real-estate/Approach";
import SocialProof from "@/components/real-estate/SocialProof";
import JournalPreview from "@/components/real-estate/JournalPreview";
import Faq from "@/components/real-estate/Faq";
import { getPosts, getProjects, getServices } from "@/lib/real-estate/api";

export default async function RealEstatePage() {
  const [services, { items }, posts] = await Promise.all([getServices(), getProjects({ limit: 8 }), getPosts()]);
  return (
    <>
      <Hero />
      <ServicesGrid services={services} />
      <PortfolioScroller projects={items} />
      <ImageGallery />
      <Approach />
      <SocialProof />
      <JournalPreview posts={posts.slice(0, 3)} />
      <Faq />
      <Statement />
    </>
  );
}
