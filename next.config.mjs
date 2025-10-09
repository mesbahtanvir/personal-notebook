/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: [
      'zustand',
      'react-hook-form',
      'framer-motion'
    ],
  },
};

export default nextConfig;
