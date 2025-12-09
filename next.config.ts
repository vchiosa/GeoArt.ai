import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "flagcdn.com",
      "firebasestorage.googleapis.com",
      "upload.wikimedia.org",
      "oaidalleapiprodscus.blob.core.windows.net",
      "assets.mediamodifier.com",
      "mediamodifier.com",
      "app-dynamicmockups-psd-engine-production.s3.eu-central-1.amazonaws.com",
    ],
  },
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(process.cwd(), "src");
    return config;
  },
};

export default nextConfig;
