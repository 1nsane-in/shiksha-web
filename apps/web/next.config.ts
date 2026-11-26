import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV !== 'production';
const atlasOrigin =
  process.env.NEXT_PUBLIC_ATLAS_URL || 'https://anatomy.shiksha.study';

// Next.js injects inline bootstrap scripts and Tailwind/inline styles, so
// 'unsafe-inline' is required until a nonce/hash pipeline exists. No
// 'unsafe-eval' in production.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://accounts.google.com https://www.gstatic.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https: wss:",
  `frame-src 'self' blob: https://accounts.google.com ${atlasOrigin}`,
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://secure.payu.in https://*.payu.in",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join('; ');

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=()',
  },
  // Google sign-in uses a popup; COOP must allow that to work.
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
  ...(isDev
    ? []
    : ([
        { key: 'Content-Security-Policy', value: contentSecurityPolicy },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains',
        },
      ] as { key: string; value: string }[])),
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Required for the standalone Docker build (copies .next/standalone).
  output: 'standalone',
  turbopack: {
    // Must be an absolute path; process.cwd() is the app root (apps/web).
    root: process.cwd(),
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/anatomy',
        destination: '/medical-academy',
        permanent: true,
      },
      {
        source: '/shiksha-acadamy',
        destination: '/shiksha-academy',
        permanent: true,
      },
    ];
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

