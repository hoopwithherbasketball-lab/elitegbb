import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Only initialize Cloudflare bindings in development mode
if (process.env.NODE_ENV === "development") {
  initOpenNextCloudflareForDev();
}

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
};

export default nextConfig;
