import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google Profile Images
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com", // Facebook Profile Images
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com", // The Placeholder API we just added
      },
    ],
  },
};

export { nextConfig };
export default nextConfig;