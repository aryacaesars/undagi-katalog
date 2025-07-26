/** @type {import('next').NextConfig} */
const nextConfig = {
  // SEO dan Performance optimizations
  poweredByHeader: false,
  compress: true,
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Headers untuk SEO dan Security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  },
  
  // Redirect untuk SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/catalog',
        destination: '/',
        permanent: false,
      }
    ]
  },
  
  // Experimental features untuk performance
  experimental: {
    // optimizeCss: true, // Disabled due to missing critters dependency
    optimizeServerReact: true,
  },
  
  // Bundle analyzer untuk optimasi
  webpack: (config, { dev, isServer }) => {
    // Optimasi untuk production
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
      }
    }
    
    return config
  },
  
  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

export default nextConfig;
