import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return [
      { source: "/lavish", destination: "/interior" },
      { source: "/lavish/:path*", destination: "/interior/:path*" },
      { source: "/imagine", destination: "/real-estate" },
      { source: "/imagine/:path*", destination: "/real-estate/:path*" },
    ];
  },
};

export default nextConfig;
