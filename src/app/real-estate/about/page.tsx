import type { Metadata } from "next";
import PageHero from "@/components/real-estate/PageHero";
import Approach from "@/components/real-estate/Approach";
import Steps from "@/components/real-estate/Steps";
import SocialProof from "@/components/real-estate/SocialProof";
import Statement from "@/components/real-estate/Statement";
import { ParallaxImage } from "@/components/real-estate/motion";
import { IMG } from "@/lib/real-estate/data";

export const metadata: Metadata = { title: "Approach" };

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="The Imagine approach" title="Creation and confidence, without compromise.">We combine thoughtful design with dependable delivery, so you feel sure at every stage of the project.</PageHero>
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16"><ParallaxImage src={IMG.duplex} alt="Imagine Interiors project" priority className="aspect-[16/8] rounded-md border border-[#1F2937]/10" /></div>
      <Statement />
      <Approach heading={false} />
      <Steps />
      <SocialProof />
    </>
  );
}
