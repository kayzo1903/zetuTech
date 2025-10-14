/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // ✅ Optional: your old R2.dev endpoint (if still used)
      {
        protocol: "https",
        hostname: "pub-b80c25803fe4421eb06c71697715f99b.r2.dev",
      },
      // ✅ Allow Unsplash images if needed
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

module.exports = nextConfig;
