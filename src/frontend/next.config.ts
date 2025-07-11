import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URI: "http://localhost:5152",
  },
};

export default nextConfig;
