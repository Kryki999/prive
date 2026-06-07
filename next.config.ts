import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cms-static-prod.ros.rockstargames.com' },
      { protocol: 'https', hostname: 'media-rockstargames-com.akamaized.net' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

export default nextConfig;
