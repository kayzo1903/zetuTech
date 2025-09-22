/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'pub-c1f7ad57930bde89e77e3c9805fc33bf.r2.dev',
      'c1f7ad57930bde89e77e3c9805fc33bf.r2.cloudflarestorage.com'
    ],
    // Optional: Configure remote patterns for more control
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-*.r2.dev',
      },
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
      },
    ],
  },
}

module.exports = nextConfig