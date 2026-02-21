import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // allow all hostnames
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
};

// Trigger restart for prisma update
export default nextConfig;
