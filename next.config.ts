// // next.config.ts
// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "cdn.sanity.io",
//       },
//       {
//         protocol: "https",
//         hostname: "lh3.googleusercontent.com", // Google Profile Images
//       },
//       {
//         protocol: "https",
//         hostname: "platform-lookaside.fbsbx.com", // Facebook Profile Images
//       },
//       {
//         protocol: "https",
//         hostname: "ui-avatars.com", // The Placeholder API
//       },
//     ],
//   },
// };

// export default nextConfig;
// next.config.ts
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
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
    ],
  },
  // Production optimizations

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
