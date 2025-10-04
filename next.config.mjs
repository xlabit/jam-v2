/** @type {import('next').NextConfig} */
const nextConfig = {
  // For local development, basePath is '/'
  // This file will be overwritten during deployment with the appropriate basePath
  images: {},
  output: 'standalone',
  // Configure for Replit environment to allow proxy/iframe access
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ];
  },
  // Allow dev origins for Replit
  allowedDevOrigins: [
    '*.replit.dev',
    '127.0.0.1',
    'localhost',
  ],
};

export default nextConfig;
