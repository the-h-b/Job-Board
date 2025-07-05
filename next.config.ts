import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['mongoose'],
  // Disable static export for API routes
  trailingSlash: false,
  // Handle build-time errors more gracefully
  onDemandEntries: {
    // Keep pages in memory for this long
    maxInactiveAge: 25 * 1000,
    // Number of pages to keep in memory
    pagesBufferLength: 2,
  },
};

export default nextConfig;
