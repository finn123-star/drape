import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**.fashn.ai' },
      { protocol: 'https', hostname: 'img.aboutyou.de' },
      { protocol: 'https', hostname: 'img.zalando.net' },
      { protocol: 'https', hostname: 'images.asos-media.com' },
      { protocol: 'https', hostname: '**.asket.com' },
    ],
  },
}

export default nextConfig
