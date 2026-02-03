import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /**
   * Bundle Size Optimization (CRITICAL)
   * @see https://vercel.com/blog/how-we-optimized-package-imports-in-next-js
   * Automatically transforms barrel file imports to direct imports at build time.
   */
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "echarts-for-react",
      "@tanstack/react-query",
    ],
  },
};

export default nextConfig;
