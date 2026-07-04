import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "akiraprint.vercel.app",
          },
        ],
        destination: "https://www.akiraprint.it/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;