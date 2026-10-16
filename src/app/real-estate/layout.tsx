import type { Metadata } from "next";
import localFont from "next/font/local";
import RealEstateHeader from "@/components/real-estate/RealEstateHeader";
import LeadOverlay from "@/components/real-estate/LeadOverlay";
import FloatingContact from "@/components/real-estate/FloatingContact";
import Cursor from "@/components/real-estate/Cursor";
import Footer from "@/components/real-estate/Footer";
import SmoothScroll from "@/components/motion/SmoothScroll";

const waldenburg = localFont({
  src: [
    {
      path: "../../../public/fonts/kmr-waldenburg.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/fonts/kmr-waldenburg-medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../public/fonts/kmr-waldenburg-medium.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../../public/fonts/kmr-waldenburg-medium.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-waldenburg",
  display: "swap",
  fallback: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
});

export const metadata: Metadata = {
  title: { default: "Imagine Interiors | Interior Design Company in Bangladesh", template: "%s | Imagine Interiors" },
  description: "Stylish residential & commercial interior design in Dhaka and Chittagong. Detailed consultation, premium materials, on-time delivery.",
};

export default function RealEstateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`real-estate-root ${waldenburg.variable} min-h-screen overflow-x-clip  text-[#1F2937] antialiased selection:bg-[#2F7D5B] selection:text-white`}>
      <SmoothScroll lerp={0.09} />
      <Cursor />
      <RealEstateHeader />
      <main>{children}</main>
      <Footer />
      <LeadOverlay />
      <FloatingContact />
    </div>
  );
}
