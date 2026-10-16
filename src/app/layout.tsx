import type { Metadata, Viewport } from "next";
import "./globals.css";
import CustomScrollbar from "@/components/ui/CustomScrollbar";

export const metadata: Metadata = {
  title: "Samir Imperia | Interior & Real Estate",
  description: "Interior design and real estate studios",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <CustomScrollbar />
      </body>
    </html>
  );
}
