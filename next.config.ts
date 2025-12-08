import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // ✅ Disables double useEffect calls in development
  images: {
    domains: [
      "flagcdn.com",
      "firebasestorage.googleapis.com",
      "upload.wikimedia.org",
      "oaidalleapiprodscus.blob.core.windows.net",
      "assets.mediamodifier.com", // ✅ Allow Mediamodifier preview images
      "mediamodifier.com", // ✅ Allow temporary Mediamodifier mockup images
      "app-dynamicmockups-psd-engine-production.s3.eu-central-1.amazonaws.com", // ✅ Add DynamicMockups AWS domain
    ],
  },
};

export default nextConfig;
