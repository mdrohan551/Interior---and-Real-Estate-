import type { Metadata } from "next";
import PageHero from "@/components/real-estate/PageHero";
import ServicesGrid from "@/components/real-estate/ServicesGrid";
import Steps from "@/components/real-estate/Steps";
import CtaStrip from "@/components/real-estate/CtaStrip";
import { getServices } from "@/lib/real-estate/api";

export const metadata: Metadata = { title: "Services" };

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <PageHero eyebrow="Services" title="Design for every kind of space.">Home, office, restaurant and custom furniture, delivered with detailed consultation, premium materials and on-time delivery.</PageHero>
      <ServicesGrid services={services} heading={false} />
      <Steps />
      <CtaStrip title="Not sure which service you need? Let's talk." />
    </>
  );
}
