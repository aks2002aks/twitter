/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: [
      "toppng.com",
      "lh3.googleusercontent.com",
      "localhost",
      "firebasestorage.googleapis.com",
      "e7.pngegg.com",
      "cdn.pixabay.com"
    ],
  },
};

module.exports = nextConfig;
