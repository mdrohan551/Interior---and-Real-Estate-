import HomeHero from "@/components/interior/home/HomeHero";
import StatsStrip from "@/components/interior/home/StatsStrip";
import ProjectIntro from "@/components/interior/home/ProjectIntro";
import ServicesPreview from "@/components/interior/home/ServicesPreview";
import PortfolioPreview from "@/components/interior/home/PortfolioPreview";
import ScrollExpandMedia from "@/components/interior/home/ScrollExpandMedia";
import ProcessTimeline from "@/components/interior/home/ProcessTimeline";
import Testimonials from "@/components/interior/home/Testimonials";
import BlogPreview from "@/components/interior/home/BlogPreview";
import CtaBand from "@/components/interior/CtaBand";

export default function InteriorHome() {
  return (
    <>
      <HomeHero />
      <StatsStrip />
      <ProjectIntro />
      <ServicesPreview />
      <PortfolioPreview />
      <ScrollExpandMedia />
      <ProcessTimeline />
      <Testimonials />
      <BlogPreview />
      <CtaBand />
    </>
  );
}

export { InteriorHome };

