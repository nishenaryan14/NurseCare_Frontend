import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://nursecare-backend-luth.onrender.com',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'https://nursecare-backend-luth.onrender.com'}/:path*`,
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: true, // Temporary for deployment
  },
  eslint: {
    ignoreDuringBuilds: true, // Temporary for deployment
  },
};

export default nextConfig;
