import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.dog.ceo",
        port: "",
        pathname: "/breeds/**",
      },
    ],
  },
};

export default nextConfig;
