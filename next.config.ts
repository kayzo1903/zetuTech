/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // ✅ Your Cloudflare R2 bucket
      {
        protocol: "https",
        hostname: "zetutech.c1f7ad57930bde89e77e3c9805fc33bf.r2.cloudflarestorage.com",
      },
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
