import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // Accept the old Vite variable name so existing deployments keep working.
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || process.env.VITE_API_BASE_URL,
  },
};

export default nextConfig;
