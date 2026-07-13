import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: process.env.GITHUB_ACTIONS ? "/phd-english-plan" : "",
  assetPrefix: process.env.GITHUB_ACTIONS ? "/phd-english-plan/" : "",
  images: { unoptimized: true },
};

export default nextConfig;
