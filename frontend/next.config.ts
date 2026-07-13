import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname, '..'),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zsi-bucket.s3.us-west-1.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
