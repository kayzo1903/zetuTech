// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [new URL('https://pub-b80c25803fe4421eb06c71697715f99b.r2.dev/products/**')],
  },
}

module.exports = nextConfig;