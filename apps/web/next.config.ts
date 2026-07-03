import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: '.',
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Auto-convert to modern formats
    formats: ['image/avif', 'image/webp'],
    // Responsive breakpoints
    deviceSizes: [480, 768, 1024, 1280, 1536],
    imageSizes: [64, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'wciecorganization.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: '*.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shiksha.study',
      },
    ],
  },
};

let finalConfig: NextConfig = nextConfig;

if (process.env.ANALYZE === 'true') {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: true,
  });
  finalConfig = withBundleAnalyzer(finalConfig);
}

export default finalConfig;

