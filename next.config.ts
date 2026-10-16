import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/OSW-Listen-with-speaking",
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: false,
};

export default nextConfig;
